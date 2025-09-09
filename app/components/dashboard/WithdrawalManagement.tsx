"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { withdrawalService } from "@/lib/services/withdrawalService";
import { currencyService } from "@/lib/services/currencyService";
import { BankDetails, Withdrawal } from "@/types/database";
import {
  FiDollarSign,
  FiCreditCard,
  FiPlus,
  FiCheck,
  FiClock,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiDownload,
} from "react-icons/fi";
import { ResponsiveFormModal } from "@/components/ui/ResponsiveModal";

interface BalanceInfo {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  pendingWithdrawals: number;
}

export default function WithdrawalManagement() {
  const [user] = useAuthState(auth);
  const [balance, setBalance] = useState<BalanceInfo>({
    availableBalance: 0,
    pendingBalance: 0,
    totalEarnings: 0,
    pendingWithdrawals: 0,
  });
  const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddBank, setShowAddBank] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  // Bank form state
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
    bankCode: "",
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [balanceData, bankData, withdrawalData] = await Promise.all([
        withdrawalService.getCreatorBalance(user.uid),
        withdrawalService.getBankDetails(user.uid),
        withdrawalService.getWithdrawalHistory(user.uid),
      ]);

      setBalance(balanceData);
      setBankDetails(bankData);
      setWithdrawals(withdrawalData);

      // Set default bank as selected
      const defaultBank = bankData.find((bank) => bank.isDefault);
      if (defaultBank) {
        setSelectedBankId(defaultBank.id);
      }
    } catch (error) {
      console.error("Error fetching withdrawal data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setProcessing(true);
    try {
      await withdrawalService.addBankDetails({
        creatorId: user.uid,
        bankName: bankForm.bankName,
        accountNumber: bankForm.accountNumber,
        accountName: bankForm.accountName,
        bankCode: bankForm.bankCode,
        isVerified: false,
        isDefault: bankDetails.length === 0,
      });

      // Reset form and refresh data
      setBankForm({
        bankName: "",
        accountNumber: "",
        accountName: "",
        bankCode: "",
      });
      setShowAddBank(false);
      await fetchData();
      alert("Bank details added successfully!");
    } catch (error) {
      console.error("Error adding bank details:", error);
      alert("Failed to add bank details. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleVerifyBank = async (bank: BankDetails) => {
    setProcessing(true);
    try {
      const result = await withdrawalService.verifyBankDetails(
        bank.id,
        bank.accountNumber,
        bank.bankName,
        bank.bankCode
      );
      if (result.success) {
        await fetchData();
        alert("Bank details verified successfully!");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error verifying bank details:", error);
      alert("Failed to verify bank details.");
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedBankId) return;

    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > balance.availableBalance) {
      alert("Invalid withdrawal amount");
      return;
    }

    setProcessing(true);
    try {
      const result = await withdrawalService.createWithdrawalRequest({
        creatorId: user.uid,
        amount,
        currency: "USD",
        bankDetailsId: selectedBankId,
      });

      if (result.success) {
        setWithdrawAmount("");
        setShowWithdrawForm(false);
        await fetchData();
        alert("Withdrawal request submitted successfully!");
      } else {
        alert(result.error || "Failed to create withdrawal request");
      }
    } catch (error) {
      console.error("Error creating withdrawal request:", error);
      alert("Failed to submit withdrawal request.");
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return currencyService.formatCurrency(amount, "USD");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FiCheck className="w-4 h-4 text-green-600" />;
      case "processing":
        return <FiLoader className="w-4 h-4 text-blue-600 animate-spin" />;
      case "failed":
        return <FiX className="w-4 h-4 text-red-600" />;
      case "cancelled":
        return <FiX className="w-4 h-4 text-gray-600" />;
      default:
        return <FiClock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-12">
          <FiLoader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Loading withdrawal data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">
                Available Balance
              </p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {formatCurrency(balance.availableBalance)}
              </p>
              <p className="text-xs text-gray-500">Ready for withdrawal</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(balance.pendingBalance)}
              </p>
              <p className="text-xs text-gray-500">Processing</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiDownload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Withdrawals
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(balance.pendingWithdrawals)}
              </p>
              <p className="text-xs text-gray-500">In process</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(balance.totalEarnings)}
              </p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowAddBank(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Bank Account
          </button>

          {balance.availableBalance > 0 &&
            bankDetails.some((bank) => bank.isVerified) && (
              <button
                onClick={() => setShowWithdrawForm(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Request Withdrawal
              </button>
            )}
        </div>

        {balance.availableBalance > 0 &&
          !bankDetails.some((bank) => bank.isVerified) && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <FiAlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  Add and verify a bank account to withdraw your earnings.
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Bank Details Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Bank Accounts</h2>
        </div>

        <div className="p-6">
          {bankDetails.length === 0 ? (
            <div className="text-center py-8">
              <FiCreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bank accounts
              </h3>
              <p className="text-gray-600 mb-4">
                Add a bank account to receive withdrawals
              </p>
              <button
                onClick={() => setShowAddBank(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Bank Account
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bankDetails.map((bank) => (
                <div
                  key={bank.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {bank.bankName}
                        </h3>
                        {bank.isDefault && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Default
                          </span>
                        )}
                        {bank.isVerified ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Unverified
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{bank.accountName}</p>
                        <p>****{bank.accountNumber.slice(-4)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!bank.isVerified && (
                        <button
                          onClick={() => handleVerifyBank(bank)}
                          disabled={processing}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Bank Modal */}
      <ResponsiveFormModal
        isOpen={showAddBank}
        onClose={() => setShowAddBank(false)}
        title="Add Bank Account"
        onSubmit={handleAddBankDetails}
        submitLabel={processing ? "Adding..." : "Add Account"}
        isSubmitting={processing}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              required
              value={bankForm.bankName}
              onChange={(e) =>
                setBankForm({ ...bankForm, bankName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., First Bank of Nigeria"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              required
              value={bankForm.accountNumber}
              onChange={(e) =>
                setBankForm({ ...bankForm, accountNumber: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Name
            </label>
            <input
              type="text"
              required
              value={bankForm.accountName}
              onChange={(e) =>
                setBankForm({ ...bankForm, accountName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
        </div>
      </ResponsiveFormModal>

      {/* Withdrawal Form Modal */}
      <ResponsiveFormModal
        isOpen={showWithdrawForm}
        onClose={() => setShowWithdrawForm(false)}
        title="Request Withdrawal"
        onSubmit={handleWithdrawalRequest}
        submitLabel={processing ? "Submitting..." : "Submit Request"}
        isSubmitting={processing}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Account
            </label>
            <select
              required
              value={selectedBankId}
              onChange={(e) => setSelectedBankId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select bank account</option>
              {bankDetails
                .filter((bank) => bank.isVerified)
                .map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.bankName} - ****{bank.accountNumber.slice(-4)}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USD)
            </label>
            <input
              type="number"
              required
              min="1"
              max={balance.availableBalance}
              step="0.01"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Available: {formatCurrency(balance.availableBalance)}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Withdrawal Fee:</strong> 1% of amount
              <br />
              <strong>You&apos;ll receive:</strong>{" "}
              {withdrawAmount
                ? formatCurrency(parseFloat(withdrawAmount) * 0.99)
                : "$0.00"}
            </p>
          </div>
        </div>
      </ResponsiveFormModal>

      {/* Withdrawal History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Withdrawal History
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {withdrawals.length === 0 ? (
            <div className="p-8 text-center">
              <FiDownload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No withdrawals yet
              </h3>
              <p className="text-gray-600">
                Your withdrawal requests will appear here
              </p>
            </div>
          ) : (
            withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(withdrawal.status)}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          withdrawal.status
                        )}`}
                      >
                        {withdrawal.status.charAt(0).toUpperCase() +
                          withdrawal.status.slice(1)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Reference: {withdrawal.reference}</div>
                      <div>Bank: {withdrawal.accountDetails.bankName}</div>
                      <div>
                        Account: ****
                        {withdrawal.accountDetails.accountNumber?.slice(-4)}
                      </div>
                      <div>
                        Requested: {withdrawal.createdAt.toLocaleDateString()}
                      </div>
                      {withdrawal.completedAt && (
                        <div className="text-green-600">
                          Completed:{" "}
                          {withdrawal.completedAt.toLocaleDateString()}
                        </div>
                      )}
                      {withdrawal.failureReason && (
                        <div className="text-red-600">
                          Reason: {withdrawal.failureReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(withdrawal.amount)}
                    </div>
                    {withdrawal.fees && (
                      <div className="text-sm text-gray-500">
                        Fee: {formatCurrency(withdrawal.fees)}
                      </div>
                    )}
                    {withdrawal.netAmount && (
                      <div className="text-sm text-green-600">
                        Net: {formatCurrency(withdrawal.netAmount)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
