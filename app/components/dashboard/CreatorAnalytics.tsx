/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import {
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiStar,
  FiEye,
  FiShoppingBag,
  FiClock,
  FiAward,
  FiDownload,
} from "react-icons/fi";

interface AnalyticsData {
  totalViews: number;
  totalEarnings: number;
  availableBalance: number;
  totalOrders: number;
  completedOrders: number;
  activeOrders: number;
  averageRating: number;
  totalReviews: number;
  profileViews: number;
  projectDownloads: number;
  monthlyEarnings: number[];
  recentActivity: ActivityItem[];
  topProjects: TopProject[];
  earningsBreakdown: EarningsBreakdown;
}

interface ActivityItem {
  id: string;
  type: "order" | "review" | "view" | "download" | "withdrawal" | "commission";
  description: string;
  timestamp: string;
  amount?: number;
  projectTitle?: string;
}

interface TopProject {
  id: string;
  title: string;
  department: string;
  totalSales: number;
  revenue: number;
  rating: number;
  views: number;
}

interface EarningsBreakdown {
  readyMadeProjects: number;
  customOrders: number;
  commissionRate: number;
  totalCommission: number;
}

interface CreatorAnalyticsProps {
  userId: string;
}

export default function CreatorAnalytics({ userId }: CreatorAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!mounted) return;

      try {
        // TODO: Replace with actual API call to fetch creator analytics
        // For now, using mock data
        const mockAnalytics: AnalyticsData = {
          totalViews: 1247,
          totalEarnings: 2850.75,
          availableBalance: 1425.5,
          totalOrders: 42,
          completedOrders: 38,
          activeOrders: 4,
          averageRating: 4.8,
          totalReviews: 35,
          profileViews: 892,
          projectDownloads: 156,
          monthlyEarnings: [450, 520, 680, 750, 890, 1200],
          topProjects: [
            {
              id: "p1",
              title: "Machine Learning Stock Prediction",
              department: "Computer Science",
              totalSales: 12,
              revenue: 540.0,
              rating: 4.9,
              views: 234,
            },
            {
              id: "p2",
              title: "Business Plan Template",
              department: "Business Administration",
              totalSales: 8,
              revenue: 320.0,
              rating: 4.7,
              views: 189,
            },
          ],
          earningsBreakdown: {
            readyMadeProjects: 1680.5,
            customOrders: 1170.25,
            commissionRate: 20,
            totalCommission: 570.15,
          },
          recentActivity: [
            {
              id: "1",
              type: "order",
              description: "New custom order received",
              timestamp: "2024-01-23T10:30:00Z",
              amount: 125.0,
              projectTitle: "Data Analysis Project",
            },
            {
              id: "2",
              type: "download",
              description: "Project downloaded by student",
              timestamp: "2024-01-22T15:45:00Z",
              projectTitle: "Machine Learning Stock Prediction",
            },
            {
              id: "3",
              type: "review",
              description: "Received 5-star review",
              timestamp: "2024-01-22T09:20:00Z",
              projectTitle: "Business Plan Template",
            },
            {
              id: "4",
              type: "commission",
              description: "Platform commission deducted",
              timestamp: "2024-01-21T14:15:00Z",
              amount: -15.0,
              projectTitle: "Chemistry Lab Report",
            },
            {
              id: "5",
              type: "withdrawal",
              description: "Earnings withdrawn to bank account",
              timestamp: "2024-01-20T11:30:00Z",
              amount: -500.0,
            },
          ],
        };

        // Simulate API delay
        setTimeout(() => {
          setAnalytics(mockAnalytics);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setLoading(false);
      }
    };

    if (userId && mounted) {
      fetchAnalytics();
    }
  }, [userId, mounted]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Creator Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Creator Analytics</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Unable to load analytics data</p>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <FiDollarSign className="w-4 h-4 text-green-600" />;
      case "review":
        return <FiStar className="w-4 h-4 text-yellow-600" />;
      case "view":
        return <FiEye className="w-4 h-4 text-blue-600" />;
      default:
        return <FiTrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Creator Analytics</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Detailed Report
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Views</p>
              <p className="text-2xl font-bold text-blue-800">
                {analytics.totalViews.toLocaleString()}
              </p>
            </div>
            <FiEye className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-green-800">
                ${analytics.totalEarnings.toFixed(2)}
              </p>
            </div>
            <FiDollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-purple-800">
                {analytics.totalOrders}
              </p>
            </div>
            <FiUsers className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Avg. Rating</p>
              <p className="text-2xl font-bold text-yellow-800">
                {analytics.averageRating.toFixed(1)}
              </p>
            </div>
            <FiStar className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {analytics.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getActivityIcon(activity.type)}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
              {activity.amount && (
                <span className="text-sm font-medium text-green-600">
                  +${activity.amount.toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
