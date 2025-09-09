/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { analyticsService } from "@/lib/database";
import {
  FiEye,
  FiHeart,
  FiUsers,
  FiTrendingUp,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

interface ProjectAnalyticsProps {
  projectId: string;
  projectTitle: string;
}

interface AnalyticsData {
  views: any[];
  likes: any[];
  totalViews: number;
  totalLikes: number;
  uniqueViewers: number;
  uniqueLikers: number;
}

export default function ProjectAnalytics({
  projectId,
  projectTitle,
}: ProjectAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

  useEffect(() => {
    fetchAnalytics();
  }, [projectId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getProjectAnalytics(projectId);

      // Filter data based on time range
      const now = new Date();
      const cutoffDate = new Date();

      if (timeRange === "7d") {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (timeRange === "30d") {
        cutoffDate.setDate(now.getDate() - 30);
      }

      const filteredData =
        timeRange === "all"
          ? data
          : {
              ...data,
              views: data.views.filter(
                (view) => new Date(view.timestamp) >= cutoffDate
              ),
              likes: data.likes.filter(
                (like) => new Date(like.timestamp) >= cutoffDate
              ),
            };

      // Recalculate counts for filtered data
      if (timeRange !== "all") {
        filteredData.totalViews = filteredData.views.length;
        filteredData.totalLikes = filteredData.likes.length;
        filteredData.uniqueViewers = [
          ...new Set(filteredData.views.map((v) => v.userId)),
        ].length;
        filteredData.uniqueLikers = [
          ...new Set(filteredData.likes.map((l) => l.userId)),
        ].length;
      }

      setAnalytics(filteredData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRecentActivity = () => {
    if (!analytics) return [];

    const allActivity = [
      ...analytics.views.map((view) => ({
        type: "view",
        userId: view.userId,
        timestamp: view.timestamp,
        icon: FiEye,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      })),
      ...analytics.likes.map((like) => ({
        type: "like",
        userId: like.userId,
        timestamp: like.timestamp,
        icon: FiHeart,
        color: "text-red-600",
        bgColor: "bg-red-100",
      })),
    ];

    return allActivity
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);
  };

  const getViewsByDay = () => {
    if (!analytics) return [];

    const viewsByDay: { [key: string]: number } = {};

    analytics.views.forEach((view) => {
      const date = new Date(view.timestamp).toLocaleDateString();
      viewsByDay[date] = (viewsByDay[date] || 0) + 1;
    });

    return Object.entries(viewsByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Project Analytics - {projectTitle}
        </h3>
        <p className="text-gray-600">No analytics data available yet.</p>
      </div>
    );
  }

  const recentActivity = getRecentActivity();
  const viewsByDay = getViewsByDay();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Project Analytics - {projectTitle}
        </h3>

        {/* Time Range Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: "7d", label: "7 days" },
            { key: "30d", label: "30 days" },
            { key: "all", label: "All time" },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setTimeRange(option.key as any)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                timeRange === option.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiEye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalViews}
              </p>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiHeart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalLikes}
              </p>
              <p className="text-sm text-gray-600">Total Likes</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiUsers className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.uniqueViewers}
              </p>
              <p className="text-sm text-gray-600">Unique Viewers</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiTrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalViews > 0
                  ? (
                      (analytics.totalLikes / analytics.totalViews) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-600">Like Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
            <FiCalendar className="w-4 h-4" />
            Daily Views (Last 7 Days)
          </h4>
          <div className="space-y-2">
            {viewsByDay.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-20">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(
                        (day.count /
                          Math.max(...viewsByDay.map((d) => d.count))) *
                          100,
                        5
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {day.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
            <FiUser className="w-4 h-4" />
            Recent Activity
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <div className={`p-1 rounded ${activity.bgColor}`}>
                      <Icon className={`w-3 h-3 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        User {activity.type === "view" ? "viewed" : "liked"}{" "}
                        your project
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
