/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase/config";
import { userService, projectService } from "@/lib/database";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
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
import {
  FiHome,
  FiShoppingBag,
  FiDollarSign,
  FiBarChart,
  FiUser,
  FiMenu,
  FiX,
  FiSettings,
  FiLogOut,
  FiSearch,
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
  avatar?: string;
}

interface DashboardError {
  message: string;
  type: "fetch" | "save" | "auth";
  retryable: boolean;
}

export default function DashboardPage() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<DashboardError | null>(
    null
  );
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize component
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (
      tab &&
      [
        "overview",
        "sales",
        "purchases",
        "analytics",
        "earnings",
        "withdrawals",
      ].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch user data with error handling
  const fetchUserData = useCallback(async () => {
    if (!user || !mounted) return;

    try {
      setDataLoading(true);
      setDashboardError(null);

      const userData = await userService.getUser(user.uid);

      if (userData) {
        setUserData(userData as UserData);
      } else {
        setShowRoleSelection(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setDashboardError({
        message: "Failed to load your dashboard data",
        type: "fetch",
        retryable: true,
      });
    } finally {
      setDataLoading(false);
    }
  }, [user, mounted]);

  // Load user data
  useEffect(() => {
    if (user && mounted) {
      fetchUserData();
    }
  }, [user, mounted, fetchUserData]);

  // Handle role selection
  const handleRoleSelection = async (selectedRole: "student" | "creator") => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      setDashboardError(null);

      const newUserData: UserData = {
        fullName: user.displayName || user.email?.split("@")[0] || "User",
        role: selectedRole,
        email: user.email || "",
        createdAt: new Date().toISOString(),
        projects: 0,
        completedProjects: 0,
        balance: 0,
        totalEarnings: 0,
        avatar: user.photoURL || "",
      };

      await setDoc(doc(db, "users", user.uid), newUserData);
      setUserData(newUserData);
      setShowRoleSelection(false);
    } catch (error) {
      console.error("Error saving user role:", error);
      setDashboardError({
        message: "Failed to save your role selection",
        type: "save",
        retryable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Error boundary component
  const ErrorDisplay = ({ error }: { error: DashboardError }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <div className="flex gap-3">
          {error.retryable && (
            <button
              onClick={fetchUserData}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => router.push("/")}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );

  // Loading component
  const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );

  // Role selection component
  const RoleSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Project02!
            </h2>
            <p className="text-gray-600">
              Choose how you&apos;d like to use our platform
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelection("student")}
              disabled={isSubmitting}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left disabled:opacity-50"
            >
              <div className="font-semibold text-gray-900 text-lg mb-1">
                🎓 Student
              </div>
              <div className="text-sm text-gray-600">
                Browse and purchase academic projects, get custom work done
              </div>
            </button>

            <button
              onClick={() => handleRoleSelection("creator")}
              disabled={isSubmitting}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left disabled:opacity-50"
            >
              <div className="font-semibold text-gray-900 text-lg mb-1">
                💼 Creator
              </div>
              <div className="text-sm text-gray-600">
                Create and sell projects, earn from your expertise
              </div>
            </button>
          </div>

          {isSubmitting && (
            <div className="mt-4 text-center">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Mobile menu component
  const MobileMenu = () => (
    <div className="lg:hidden fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl transform transition-transform duration-300">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {(userData?.fullName?.charAt(0) || "U").toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-sm">{userData?.fullName}</div>
              <div className="text-xs text-gray-600">{userData?.role}</div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  // Tab configuration
  const tabs = [
    { id: "overview", label: "Overview", icon: FiHome },
    {
      id: userData?.role === "creator" ? "sales" : "purchases",
      label: userData?.role === "creator" ? "Sales" : "Purchases",
      icon: FiShoppingBag,
    },
    ...(userData?.role === "creator"
      ? [
          { id: "analytics", label: "Analytics", icon: FiBarChart },
          { id: "earnings", label: "Earnings", icon: FiDollarSign },
          { id: "withdrawals", label: "Withdrawals", icon: FiDollarSign },
        ]
      : []),
  ].filter((tab) => tab.id !== undefined);

  // Early returns for different states
  if (!mounted || loading) return <LoadingState />;
  if (error || !user) {
    router.push("/login");
    return null;
  }
  if (dashboardError) return <ErrorDisplay error={dashboardError} />;
  if (showRoleSelection) return <RoleSelection />;
  if (!userData) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Tab Bar */}
        <div className="px-4 pb-2">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.slice(0, 3).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              {/* User Profile */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {(userData.fullName?.charAt(0) || "U").toUpperCase()}
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

              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed Projects</span>
                  <span className="font-medium">
                    {userData.completedProjects || 0}
                  </span>
                </div>
                {userData.role === "creator" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Earnings</span>
                      <span className="font-medium">
                        ${(userData.totalEarnings || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available Balance</span>
                      <span className="font-medium">
                        ${(userData.balance || 0).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Desktop Tab Navigation */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <ClientOnly
              fallback={
                <div className="animate-pulse bg-gray-200 h-64 rounded-2xl" />
              }
            >
              <div className="space-y-6">
                {activeTab === "overview" && (
                  <>
                    <DashboardStats
                      role={userData.role}
                      stats={
                        userData.role === "creator"
                          ? {
                              balance: userData.balance || 0,
                              totalEarnings: userData.totalEarnings || 0,
                              activeOrders: 0,
                              completedProjects:
                                userData.completedProjects || 0,
                            }
                          : {
                              activeOrders: 0,
                              completedProjects:
                                userData.completedProjects || 0,
                              savedProjects: 0,
                              messages: 0,
                            }
                      }
                    />

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
                  </>
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
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <MobileMenu />}
    </div>
  );
}
