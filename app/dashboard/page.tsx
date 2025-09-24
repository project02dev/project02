"use client";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase/config";
import { userService, projectService } from "@/lib/database";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentProjects from "@/components/dashboard/RecentProjects";
import ActiveOrders from "@/components/dashboard/ActiveOrders";
import CreatorAnalytics from "@/components/dashboard/CreatorAnalytics";
import ShareProfileLink from "@/components/dashboard/ShareProfileLink";
import PaymentHistory from "@/components/dashboard/PaymentHistory";
import EarningsManagement from "@/components/dashboard/EarningsManagement";
import WithdrawalManagement from "@/components/dashboard/WithdrawalManagement";
import ClientOnly from "@/components/common/ClientOnly";
import { doc } from "firebase/firestore";
import {
  FiHome,
  FiShoppingBag,
  FiDollarSign,
  FiBarChart,
} from "react-icons/fi";

interface UserData {
  fullName: string;
  role: "student" | "creator";
  email: string;
  createdAt: string;
  projects?: number;
  completedProjects?: number;
  balance?: number;
  totalEarnings?: number;
}

export default function DashboardPage() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check for tab parameter in URL
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && mounted) {
        try {
          setDataLoading(true);
          setDataError(null);

          const userData = await userService.getUser(user.uid);

          if (userData) {
            setUserData(userData as UserData);
          } else {
            // Show role selection for new users
            console.log("No user document found, showing role selection");
            setShowRoleSelection(true);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setDataError("Failed to load user data");
        } finally {
          setDataLoading(false);
        }
      }
    };

    if (user && mounted) {
      fetchUserData();
    }
  }, [user, mounted]);

  const handleRoleSelection = async (selectedRole: "student" | "creator") => {
    if (!user) return;

    try {
      setDataLoading(true);
      const { setDoc } = await import("firebase/firestore");

      const newUserData: UserData = {
        fullName: user.displayName || user.email?.split("@")[0] || "User",
        role: selectedRole,
        email: user.email || "",
        createdAt: new Date().toISOString(),
        projects: 0,
        completedProjects: 0,
        balance: 0,
        totalEarnings: 0,
      };

      // Save to Firestore
      await setDoc(doc(db, "users", user.uid), newUserData);

      setUserData(newUserData);
      setShowRoleSelection(false);
    } catch (error) {
      console.error("Error saving user role:", error);
      setDataError("Failed to save user role");
    } finally {
      setDataLoading(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    router.push("/login");
    return null;
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Project02!
              </h2>
              <p className="text-gray-600">
                Please select your role to get started
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelection("student")}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left"
              >
                <div className="font-semibold text-gray-900">Student</div>
                <div className="text-sm text-gray-600">
                  Browse and purchase academic projects
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection("creator")}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left"
              >
                <div className="font-semibold text-gray-900">Creator</div>
                <div className="text-sm text-gray-600">
                  Create and sell academic projects
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Profile Section - Left Sidebar */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {(
                    userData.fullName?.charAt(0) ||
                    userData.email?.charAt(0) ||
                    "U"
                  ).toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {userData.fullName}
                </h2>
                <p className="text-sm text-gray-600 mb-2">{userData.email}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    userData.role === "creator"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {userData.role === "creator" ? "Creator" : "Student"}
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Member since</span>
                    <span className="text-gray-900">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed Projects</span>
                    <span className="text-gray-900">
                      {userData.completedProjects || 0}
                    </span>
                  </div>
                  {userData.role === "creator" && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Earnings</span>
                        <span className="text-gray-900">
                          ${(userData.totalEarnings || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available Balance</span>
                        <span className="text-gray-900">
                          ${(userData.balance || 0).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow mb-4 lg:mb-6">
              <div className="border-b border-gray-200">
                <nav
                  className="flex overflow-x-auto space-x-4 lg:space-x-8 px-4 lg:px-6 scrollbar-hide"
                  aria-label="Tabs"
                >
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 px-2 lg:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "overview"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FiHome className="w-4 h-4 inline mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">Overview</span>
                    <span className="sm:hidden">Home</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab(
                        userData.role === "creator" ? "sales" : "purchases"
                      )
                    }
                    className={`py-4 px-2 lg:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab ===
                      (userData.role === "creator" ? "sales" : "purchases")
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FiShoppingBag className="w-4 h-4 inline mr-1 lg:mr-2" />
                    {userData.role === "creator" ? "Sales" : "Purchases"}
                  </button>

                  {userData.role === "creator" && (
                    <button
                      onClick={() => setActiveTab("analytics")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "analytics"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <FiBarChart className="w-4 h-4 inline mr-2" />
                      Analytics
                    </button>
                  )}

                  {userData.role === "creator" && (
                    <button
                      onClick={() => setActiveTab("earnings")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "earnings"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <FiBarChart className="w-4 h-4 inline mr-2" />
                      Earnings
                    </button>
                  )}

                  {userData.role === "creator" && (
                    <button
                      onClick={() => setActiveTab("withdrawals")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "withdrawals"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <FiDollarSign className="w-4 h-4 inline mr-2" />
                      Withdrawals
                    </button>
                  )}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <ClientOnly
              fallback={
                <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
              }
            >
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Overview */}
                  <DashboardStats
                    role={userData.role}
                    stats={
                      userData.role === "creator"
                        ? {
                            balance: userData.balance || 0,
                            totalEarnings: userData.totalEarnings || 0,
                            activeOrders: 0,
                            completedProjects: userData.completedProjects || 0,
                          }
                        : {
                            activeOrders: 0,
                            completedProjects: userData.completedProjects || 0,
                            savedProjects: 0,
                            messages: 0,
                          }
                    }
                  />

                  {/* Role-specific sections */}
                  {userData.role === "creator" ? (
                    <>
                      <ShareProfileLink
                        userId={user.uid}
                        userName={userData.fullName}
                      />
                      <ActiveOrders userId={user.uid} role="creator" />
                    </>
                  ) : (
                    <>
                      <RecentProjects userId={user.uid} />
                      <ActiveOrders userId={user.uid} role="student" />
                    </>
                  )}
                </div>
              )}

              {activeTab === "purchases" && userData.role === "student" && (
                <PaymentHistory userRole="student" />
              )}

              {activeTab === "sales" && userData.role === "creator" && (
                <PaymentHistory userRole="creator" />
              )}

              {activeTab === "analytics" && userData.role === "creator" && (
                <CreatorAnalytics userId={user.uid} />
              )}

              {activeTab === "earnings" && userData.role === "creator" && (
                <EarningsManagement />
              )}

              {activeTab === "withdrawals" && userData.role === "creator" && (
                <WithdrawalManagement />
              )}
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  );
}
