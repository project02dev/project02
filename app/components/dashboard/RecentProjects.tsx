/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { dashboardService } from "@/lib/services/dashboardService";
import { Purchase, Project as ProjectType } from "@/types/database";
import {
  FiClock,
  FiDollarSign,
  FiUser,
  FiStar,
  FiDownload,
  FiMessageCircle,
  FiEye,
  FiLoader,
} from "react-icons/fi";

interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  creatorName: string;
  creatorAvatar?: string;
  department: string;
  purchasedAt: string;
  deliveredAt?: string;
  status: "delivered" | "in_progress" | "pending_review" | "completed";
  rating?: number;
  hasReviewed: boolean;
  downloadUrl?: string;
  previewUrl?: string;
}

interface RecentProjectsProps {
  userId?: string;
}

export default function RecentProjects({ userId }: RecentProjectsProps) {
  const [user] = useAuthState(auth);
  const [purchases, setPurchases] = useState<
    (Purchase & { project?: ProjectType })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentPurchases();
    }
  }, [user]);

  const fetchRecentPurchases = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await dashboardService.getUserPurchaseHistory(user.uid, 5);
      setPurchases(result.purchases);
    } catch (error) {
      console.error("Error fetching recent purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
        <div className="flex items-center justify-center py-8">
          <FiLoader className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600">Loading your purchases...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
        <p className="text-gray-600">Please log in to view your purchases.</p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
        <div className="text-center py-8">
          <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No purchases yet</p>
          <p className="text-sm text-gray-500">
            Start exploring projects to see your purchases here.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "delivered":
        return "text-blue-600 bg-blue-100";
      case "in_progress":
        return "text-orange-600 bg-orange-100";
      case "pending_review":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "in_progress":
        return "In Progress";
      case "pending_review":
        return "Pending Review";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const handleDownload = (purchase: Purchase & { project?: ProjectType }) => {
    if (purchase.downloadUrl) {
      // TODO: Implement secure download with authentication
      window.open(purchase.downloadUrl, "_blank");
    }
  };

  const handlePreview = (project: ProjectType) => {
    if (project.previewUrl) {
      // TODO: Open watermarked preview
      window.open(project.previewUrl, "_blank");
    }
  };

  const handleContactCreator = (project: ProjectType) => {
    if (project.creatorId) {
      // Navigate to messages page with the creator's ID
      window.location.href = `/messages?user=${project.creatorId}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Purchases</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {purchases.map((purchase) => {
          const project = purchase.project;
          if (!project) return null;

          return (
            <div
              key={project.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {project.title}
                    </h3>
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {project.department}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {project.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 mr-1" />
                      {project.creatorName}
                    </div>
                    <div className="flex items-center">
                      <FiDollarSign className="w-4 h-4 mr-1" />${project.price}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      Purchased: {purchase.createdAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <FiDownload className="w-4 h-4 mr-1" />
                      Downloads: {purchase.downloadCount}
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                  Purchased
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  {purchase.downloadUrl && (
                    <button
                      onClick={() => handleDownload(purchase)}
                      className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      <FiDownload className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  )}

                  {project.previewUrl && (
                    <button
                      onClick={() => handlePreview(project)}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      <FiEye className="w-4 h-4 mr-1" />
                      Preview
                    </button>
                  )}

                  <button
                    onClick={() => handleContactCreator(project)}
                    className="flex items-center px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                  >
                    <FiMessageCircle className="w-4 h-4 mr-1" />
                    Contact Creator
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
