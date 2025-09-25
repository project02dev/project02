/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  FiPackage,
  FiClock,
  FiDollarSign,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Order {
  clientId: any;
  creatorId: any;
  id: string;
  title: string;
  description: string;
  price: number;
  clientName?: string;
  creatorName?: string;
  department: string;
  status:
    | "pending"
    | "in_progress"
    | "review"
    | "revision_requested"
    | "completed"
    | "delivered";
  createdAt: string;
  deadline?: string;
}

interface ActiveOrdersProps {
  userId: string;
  role: "student" | "creator";
}

export default function ActiveOrders({ userId, role }: ActiveOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      setLoading(true);
      try {
        const activeStatuses = [
          "pending",
          "in_progress",
          "review",
          "revision_requested",
          "delivered",
        ];
        const q = query(
          collection(db, "orders"),
          where("clientId", "==", userId),
          where("status", "in", activeStatuses)
        );
        const snap = await getDocs(q);
        const list: Order[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(list);
      } catch (error) {
        console.error("Error fetching active orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId && role === "student") {
      fetchActiveOrders();
    }
  }, [userId, role]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Active Orders</h2>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "in_progress":
        return "text-blue-600 bg-blue-100";
      case "review":
        return "text-purple-600 bg-purple-100";
      case "revision_requested":
        return "text-orange-600 bg-orange-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "review":
        return "Under Review";
      case "revision_requested":
        return "Revision Requested";
      case "delivered":
        return "Delivered";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-semibold">Active Orders</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiPackage className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active orders</p>
            <p className="text-sm">
              Your orders will appear here once you make a purchase
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1 text-base sm:text-lg">
                    {order.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    {order.description}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
                  <div className="flex items-center">
                    <FiUser className="w-4 h-4 mr-1" />
                    {order.creatorName}
                  </div>
                  <div className="flex items-center">
                    <FiDollarSign className="w-4 h-4 mr-1" />${order.price}
                  </div>
                  {order.deadline && (
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      Due: {new Date(order.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <FiMessageCircle className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
