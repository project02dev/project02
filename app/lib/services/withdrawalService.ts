import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { BankDetails, Withdrawal, CreatorEarnings } from "@/types/database";

export class WithdrawalService {
  // Get creator's available balance
  async getCreatorBalance(creatorId: string): Promise<{
    availableBalance: number;
    pendingBalance: number;
    totalEarnings: number;
    pendingWithdrawals: number;
  }> {
    try {
      // Get all earnings for the creator
      const earningsQuery = query(
        collection(db, "earnings"),
        where("creatorId", "==", creatorId)
      );
      const earningsSnapshot = await getDocs(earningsQuery);
      const earnings = earningsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CreatorEarnings[];

      // Get pending withdrawals
      const withdrawalsQuery = query(
        collection(db, "withdrawals"),
        where("creatorId", "==", creatorId),
        where("status", "in", ["pending", "processing"])
      );
      const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
      const pendingWithdrawals = withdrawalsSnapshot.docs.reduce((sum, doc) => {
        return sum + (doc.data().amount || 0);
      }, 0);

      // Calculate balances
      const availableEarnings = earnings
        .filter((e) => e.status === "available")
        .reduce((sum, e) => sum + e.netAmount, 0);

      const pendingEarnings = earnings
        .filter((e) => e.status === "pending")
        .reduce((sum, e) => sum + e.netAmount, 0);

      const totalEarnings = earnings.reduce((sum, e) => sum + e.netAmount, 0);

      // Available balance = available earnings - pending withdrawals
      const availableBalance = Math.max(
        0,
        availableEarnings - pendingWithdrawals
      );

      return {
        availableBalance,
        pendingBalance: pendingEarnings,
        totalEarnings,
        pendingWithdrawals,
      };
    } catch (error) {
      console.error("Error getting creator balance:", error);
      return {
        availableBalance: 0,
        pendingBalance: 0,
        totalEarnings: 0,
        pendingWithdrawals: 0,
      };
    }
  }

  // Add bank details
  async addBankDetails(
    bankDetails: Omit<BankDetails, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      // Check if this is the first bank account (make it default)
      const existingQuery = query(
        collection(db, "bankDetails"),
        where("creatorId", "==", bankDetails.creatorId)
      );
      const existingSnapshot = await getDocs(existingQuery);
      const isFirstAccount = existingSnapshot.empty;

      const docRef = await addDoc(collection(db, "bankDetails"), {
        ...bankDetails,
        isDefault: isFirstAccount || bankDetails.isDefault,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // If this is set as default, update other accounts
      if (bankDetails.isDefault && !isFirstAccount) {
        await this.setDefaultBankAccount(bankDetails.creatorId, docRef.id);
      }

      return docRef.id;
    } catch (error) {
      console.error("Error adding bank details:", error);
      throw error;
    }
  }

  // Get creator's bank details
  async getBankDetails(creatorId: string): Promise<BankDetails[]> {
    try {
      const q = query(
        collection(db, "bankDetails"),
        where("creatorId", "==", creatorId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as BankDetails[];
    } catch (error) {
      console.error("Error getting bank details:", error);
      return [];
    }
  }

  // Set default bank account
  async setDefaultBankAccount(
    creatorId: string,
    bankDetailsId: string
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Remove default from all other accounts
      const allAccountsQuery = query(
        collection(db, "bankDetails"),
        where("creatorId", "==", creatorId)
      );
      const allAccountsSnapshot = await getDocs(allAccountsQuery);

      allAccountsSnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { isDefault: false });
      });

      // Set the selected account as default
      const selectedAccountRef = doc(db, "bankDetails", bankDetailsId);
      batch.update(selectedAccountRef, { isDefault: true });

      await batch.commit();
    } catch (error) {
      console.error("Error setting default bank account:", error);
      throw error;
    }
  }

  // Verify bank details using API
  async verifyBankDetails(
    bankDetailsId: string,
    accountNumber: string,
    bankName: string,
    bankCode?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch("/api/verify-bank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bankDetailsId,
          accountNumber,
          bankName,
          bankCode,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error verifying bank details:", error);
      return {
        success: false,
        message: "Failed to verify bank details",
      };
    }
  }

  // Create withdrawal request
  async createWithdrawalRequest(withdrawalData: {
    creatorId: string;
    amount: number;
    currency: string;
    bankDetailsId: string;
  }): Promise<{ success: boolean; withdrawalId?: string; error?: string }> {
    try {
      // Check available balance
      const balance = await this.getCreatorBalance(withdrawalData.creatorId);
      if (withdrawalData.amount > balance.availableBalance) {
        return {
          success: false,
          error: "Insufficient balance for withdrawal",
        };
      }

      // Get bank details
      const bankDetailsDoc = await getDoc(
        doc(db, "bankDetails", withdrawalData.bankDetailsId)
      );
      if (!bankDetailsDoc.exists()) {
        return {
          success: false,
          error: "Bank details not found",
        };
      }

      const bankDetails = bankDetailsDoc.data() as BankDetails;
      if (!bankDetails.isVerified) {
        return {
          success: false,
          error: "Bank details not verified",
        };
      }

      // Calculate fees (e.g., 1% withdrawal fee)
      const fees = withdrawalData.amount * 0.01; // 1% fee
      const netAmount = withdrawalData.amount - fees;

      // Create withdrawal request
      const withdrawal: Omit<Withdrawal, "id"> = {
        creatorId: withdrawalData.creatorId,
        amount: withdrawalData.amount,
        currency: withdrawalData.currency,
        method: "bank_transfer",
        bankDetailsId: withdrawalData.bankDetailsId,
        accountDetails: {
          bankName: bankDetails.bankName,
          accountNumber: bankDetails.accountNumber,
          accountName: bankDetails.accountName,
        },
        status: "pending",
        reference: `WD_${Date.now()}_${withdrawalData.creatorId.slice(-6)}`,
        fees,
        netAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "withdrawals"), {
        ...withdrawal,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        withdrawalId: docRef.id,
      };
    } catch (error) {
      console.error("Error creating withdrawal request:", error);
      return {
        success: false,
        error: "Failed to create withdrawal request",
      };
    }
  }

  // Get withdrawal history
  async getWithdrawalHistory(
    creatorId: string,
    limitCount: number = 20
  ): Promise<Withdrawal[]> {
    try {
      const q = query(
        collection(db, "withdrawals"),
        where("creatorId", "==", creatorId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        processedAt: doc.data().processedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Withdrawal[];
    } catch (error) {
      console.error("Error getting withdrawal history:", error);
      return [];
    }
  }

  // Cancel withdrawal (only if pending)
  async cancelWithdrawal(
    withdrawalId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const withdrawalDoc = await getDoc(doc(db, "withdrawals", withdrawalId));
      if (!withdrawalDoc.exists()) {
        return { success: false, message: "Withdrawal not found" };
      }

      const withdrawal = withdrawalDoc.data() as Withdrawal;
      if (withdrawal.status !== "pending") {
        return {
          success: false,
          message: "Can only cancel pending withdrawals",
        };
      }

      await updateDoc(doc(db, "withdrawals", withdrawalId), {
        status: "cancelled",
        updatedAt: serverTimestamp(),
        adminNotes: "Cancelled by user",
      });

      return { success: true, message: "Withdrawal cancelled successfully" };
    } catch (error) {
      console.error("Error cancelling withdrawal:", error);
      return { success: false, message: "Failed to cancel withdrawal" };
    }
  }

  // Delete bank details
  async deleteBankDetails(
    bankDetailsId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Check if there are pending withdrawals using this bank account
      const pendingWithdrawalsQuery = query(
        collection(db, "withdrawals"),
        where("bankDetailsId", "==", bankDetailsId),
        where("status", "in", ["pending", "processing"])
      );
      const pendingSnapshot = await getDocs(pendingWithdrawalsQuery);

      if (!pendingSnapshot.empty) {
        return {
          success: false,
          message: "Cannot delete bank details with pending withdrawals",
        };
      }

      await deleteDoc(doc(db, "bankDetails", bankDetailsId));
      return { success: true, message: "Bank details deleted successfully" };
    } catch (error) {
      console.error("Error deleting bank details:", error);
      return { success: false, message: "Failed to delete bank details" };
    }
  }
}

export const withdrawalService = new WithdrawalService();
export default withdrawalService;
