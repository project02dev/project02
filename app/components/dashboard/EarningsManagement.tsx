/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { CreatorEarnings } from "@/types/database";
import { currencyService } from "@/lib/services/currencyService";
import {
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiDownload,
  FiClock,
  FiCheck,
  FiLoader,
  FiBarChart,
  FiPieChart,
} from "react-icons/fi";

interface EarningsStats {
  totalEarnings: number;
  availableBalance: number;
  pendingEarnings: number;
  totalWithdrawn: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
}

export default function EarningsManagement() {
  const [user] = useAuthState(auth);
  const [earnings, setEarnings] = useState<CreatorEarnings[]>([]);
  const [stats, setStats] = useState<EarningsStats>({
    totalEarnings: 0,
    availableBalance: 0,
    pendingEarnings: 0,
    totalWithdrawn: 0,
    thisMonthEarnings: 0,
    lastMonthEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "available" | "pending" | "paid"
  >("all");

  useEffect(() => {
    if (user) {
      fetchEarnings();
    }
  }, [user]);

  const fetchEarnings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch all earnings for the creator
      const earningsQuery = query(
        collection(db, "earnings"),
        where("creatorId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(100)
      );

      const earningsSnapshot = await getDocs(earningsQuery);
      const earningsData = earningsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        paidAt: doc.data().paidAt?.toDate(),
      })) as CreatorEarnings[];

      setEarnings(earningsData);

      // Calculate stats
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const calculatedStats: EarningsStats = {
        totalEarnings: earningsData.reduce(
          (sum, earning) => sum + earning.netAmount,
          0
        ),
        availableBalance: earningsData
          .filter((e) => e.status === "available")
          .reduce((sum, earning) => sum + earning.netAmount, 0),
        pendingEarnings: earningsData
          .filter((e) => e.status === "pending")
          .reduce((sum, earning) => sum + earning.netAmount, 0),
        totalWithdrawn: earningsData
          .filter((e) => e.status === "paid")
          .reduce((sum, earning) => sum + earning.netAmount, 0),
        thisMonthEarnings: earningsData
          .filter((e) => e.createdAt >= thisMonth)
          .reduce((sum, earning) => sum + earning.netAmount, 0),
        lastMonthEarnings: earningsData
          .filter(
            (e) => e.createdAt >= lastMonth && e.createdAt <= lastMonthEnd
          )
          .reduce((sum, earning) => sum + earning.netAmount, 0),
      };

      setStats(calculatedStats);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return currencyService.formatCurrency(amount, currency as "USD" | "NGN");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <FiCheck className="w-4 h-4 text-green-600" />;
      case "pending":
        return <FiClock className="w-4 h-4 text-yellow-600" />;
      case "paid":
        return <FiDownload className="w-4 h-4 text-blue-600" />;
      default:
        return <FiClock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEarnings = earnings.filter((earning) => {
    if (filter === "all") return true;
    return earning.status === filter;
  });

  const growthPercentage =
    stats.lastMonthEarnings > 0
      ? ((stats.thisMonthEarnings - stats.lastMonthEarnings) /
          stats.lastMonthEarnings) *
        100
      : stats.thisMonthEarnings > 0
      ? 100
      : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-12">
          <FiLoader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Loading earnings data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.availableBalance)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalEarnings)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.pendingEarnings)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiBarChart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.thisMonthEarnings)}
              </p>
              {growthPercentage !== 0 && (
                <p
                  className={`text-sm ${
                    growthPercentage > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {growthPercentage > 0 ? "+" : ""}
                  {growthPercentage.toFixed(1)}% from last month
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Earnings List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Earnings History
            </h2>
            <div className="flex items-center space-x-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Earnings</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="paid">Withdrawn</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredEarnings.length === 0 ? (
            <div className="p-8 text-center">
              <FiPieChart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No earnings yet
              </h3>
              <p className="text-gray-600">
                Your earnings will appear here when customers purchase your
                projects.
              </p>
            </div>
          ) : (
            filteredEarnings.map((earning) => (
              <div
                key={earning.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(earning.status)}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          earning.status
                        )}`}
                      >
                        {earning.status.charAt(0).toUpperCase() +
                          earning.status.slice(1)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Order: #{earning.orderId.slice(-8)}</div>
                      <div>Project: {earning.projectId.slice(-8)}</div>
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {formatDate(earning.createdAt)}
                      </div>
                      {earning.paidAt && (
                        <div className="text-blue-600">
                          Paid: {formatDate(earning.paidAt)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(earning.netAmount, earning.currency)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Gross:{" "}
                      {formatCurrency(earning.grossAmount, earning.currency)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Platform fee:{" "}
                      {formatCurrency(earning.platformFee, earning.currency)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Withdrawal Section */}
      {stats.availableBalance > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Withdraw Earnings
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiDollarSign className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  You have {formatCurrency(stats.availableBalance)} available
                  for withdrawal
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Withdrawal feature coming soon. Contact support for manual
                  withdrawals.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
