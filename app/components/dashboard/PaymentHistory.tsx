/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { paymentService } from "@/lib/services/paymentService";
import { dashboardService } from "@/lib/services/dashboardService";
import { currencyService } from "@/lib/services/currencyService";
import { Order, Purchase } from "@/types/database";
import {
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiShoppingBag,
  FiDownload,
  FiEye,
  FiLoader,
  FiFilter,
  FiSearch,
  FiExternalLink,
} from "react-icons/fi";
import Link from "next/link";

interface PaymentHistoryProps {
  userRole: "student" | "creator";
}

export default function PaymentHistory({ userRole }: PaymentHistoryProps) {
  const [user] = useAuthState(auth);
  const [purchases, setPurchases] = useState<(Purchase & { project?: any })[]>(
    []
  );
  const [sales, setSales] = useState<(Order & { project?: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (user) {
      fetchPaymentHistory();
    }
  }, [user, userRole]);

  const fetchPaymentHistory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (userRole === "student") {
        // Fetch user purchases
        const purchaseHistory = await dashboardService.getUserPurchaseHistory(
          user.uid,
          50
        );
        setPurchases(purchaseHistory.purchases);
      } else {
        // Fetch creator sales
        const salesHistory = await dashboardService.getCreatorSalesHistory(
          user.uid,
          50
        );
        setSales(salesHistory.sales);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return currencyService.formatCurrency(amount, currency as "USD" | "NGN");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleDownload = async (purchase: Purchase & { project?: any }) => {
    if (!user) return;

    try {
      const response = await fetch(
        `/api/download/${purchase.projectId}?userId=${user.uid}`
      );
      const data = await response.json();

      if (data.success) {
        // Open download URL in new tab
        window.open(data.downloadUrl, "_blank");

        // Show remaining downloads info
        if (data.remainingDownloads !== undefined) {
          alert(
            `Download started! You have ${data.remainingDownloads} downloads remaining.`
          );
        }
      } else {
        alert(`Download failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredData = userRole === "student" ? purchases : sales;
  const displayData = filteredData
    .filter((item) => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (userRole === "student") {
          const purchase = item as Purchase & { project?: any };
          return (
            purchase.projectTitle?.toLowerCase().includes(searchLower) ||
            purchase.project?.creatorName?.toLowerCase().includes(searchLower)
          );
        } else {
          const sale = item as Order & { project?: any };
          return (
            sale.projectTitle?.toLowerCase().includes(searchLower) ||
            sale.buyerName?.toLowerCase().includes(searchLower)
          );
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortBy === "amount") {
        return (b as any).amount - (a as any).amount;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-12">
          <FiLoader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Loading payment history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {userRole === "student" ? "Purchase History" : "Sales History"}
          </h2>
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount">Highest Amount</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${
              userRole === "student"
                ? "projects or creators"
                : "projects or buyers"
            }...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Payment List */}
      <div className="divide-y divide-gray-200">
        {displayData.length === 0 ? (
          <div className="p-8 text-center">
            <FiShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {userRole === "student" ? "purchases" : "sales"} yet
            </h3>
            <p className="text-gray-600">
              {userRole === "student"
                ? "Start exploring projects to make your first purchase!"
                : "Your sales will appear here when customers purchase your projects."}
            </p>
            {userRole === "student" && (
              <Link
                href="/explore"
                className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiShoppingBag className="w-4 h-4 mr-2" />
                Browse Projects
              </Link>
            )}
          </div>
        ) : (
          displayData.map((item) => {
            if (userRole === "student") {
              const purchase = item as Purchase & { project?: any };
              return (
                <div
                  key={purchase.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {purchase.projectTitle}
                        </h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Purchased
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FiUser className="w-4 h-4 mr-1" />
                          {purchase.project?.creatorName || "Unknown Creator"}
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          {formatDate(purchase.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <FiDownload className="w-4 h-4 mr-1" />
                          {purchase.downloadCount} downloads
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/project/${purchase.projectId}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <FiEye className="w-4 h-4 mr-1" />
                          View Project
                        </Link>
                        <button
                          onClick={() => handleDownload(purchase)}
                          className="inline-flex items-center text-green-600 hover:text-green-800 text-sm"
                        >
                          <FiDownload className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(purchase.amount, purchase.currency)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Order #{purchase.orderId.slice(-8)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              const sale = item as Order & { project?: any };
              return (
                <div
                  key={sale.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {sale.projectTitle}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            sale.status
                          )}`}
                        >
                          {sale.status.charAt(0).toUpperCase() +
                            sale.status.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FiUser className="w-4 h-4 mr-1" />
                          {sale.buyerName}
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          {formatDate(sale.completedAt || sale.createdAt)}
                        </div>
                        {sale.paymentReference && (
                          <div className="flex items-center">
                            <FiExternalLink className="w-4 h-4 mr-1" />
                            Ref: {sale.paymentReference.slice(-8)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/project/${sale.projectId}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <FiEye className="w-4 h-4 mr-1" />
                          View Project
                        </Link>
                        <Link
                          href={`/messages?user=${sale.buyerId}`}
                          className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm"
                        >
                          <FiUser className="w-4 h-4 mr-1" />
                          Contact Buyer
                        </Link>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(sale.amount, sale.currency)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Order #{sale.id.slice(-8)}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Net: {formatCurrency(sale.amount * 0.85, sale.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })
        )}
      </div>
    </div>
  );
}
