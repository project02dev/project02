/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import {
  FiPackage,
  FiClock,
  FiDollarSign,
  FiUser,
  FiMessageCircle,
  FiFileText,
  FiUpload,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

interface Order {
  clientId: any;
  creatorId: any;
  id: string;
  title: string;
  description: string;
  price: number;
  clientName?: string;
  creatorName?: string;
  clientAvatar?: string;
  creatorAvatar?: string;
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
  deliveryDate?: string;
  milestones?: Milestone[];
  isCustomOrder: boolean;
  requirements?: string;
  deliverables?: string[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed";
  deliverable?: string;
}

interface ActiveOrdersProps {
  userId: string;
  role: "student" | "creator";
}

export default function ActiveOrders({ userId, role }: ActiveOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      if (!mounted) return;

      try {
        // TODO: Replace with actual API call to fetch user's active orders
        // For now, using mock data based on role
        const mockOrders: Order[] =
          role === "creator"
            ? [
                {
                  id: "1",
                  clientId: "client-1",
                  creatorId: userId,
                  title: "Custom Data Analysis Project",
                  description:
                    "Statistical analysis of customer behavior data with Python and visualization",
                  price: 125.0,
                  clientName: "John Doe",
                  clientAvatar: "/images/clients/john-doe.jpg",
                  department: "Data Science",
                  status: "in_progress",
                  createdAt: "2024-01-20",
                  deadline: "2024-01-28",
                  isCustomOrder: true,
                  requirements:
                    "Need comprehensive analysis with Python, pandas, and matplotlib visualizations",
                  milestones: [
                    {
                      id: "m1",
                      title: "Data Cleaning & Preprocessing",
                      description: "Clean and prepare the dataset",
                      dueDate: "2024-01-23",
                      status: "completed",
                      deliverable: "cleaned_dataset.csv",
                    },
                    {
                      id: "m2",
                      title: "Statistical Analysis",
                      description:
                        "Perform statistical analysis and create visualizations",
                      dueDate: "2024-01-26",
                      status: "pending",
                    },
                  ],
                  deliverables: [
                    "Python notebook",
                    "Cleaned dataset",
                    "Analysis report",
                    "Visualizations",
                  ],
                },
                {
                  id: "2",
                  clientId: "client-2",
                  creatorId: userId,
                  title: "Business Plan Review & Enhancement",
                  description:
                    "Review and enhance existing business plan with market analysis",
                  price: 85.0,
                  clientName: "Sarah Johnson",
                  clientAvatar: "/images/clients/sarah-johnson.jpg",
                  department: "Business Administration",
                  status: "review",
                  createdAt: "2024-01-22",
                  deadline: "2024-01-30",
                  deliveryDate: "2024-01-25",
                  isCustomOrder: true,
                  requirements:
                    "Enhance existing business plan with detailed market analysis and financial projections",
                },
              ]
            : [
                {
                  id: "3",
                  clientId: userId,
                  creatorId: "creator-1",
                  title: "Custom Machine Learning Model",
                  description:
                    "Complete ML model for stock prediction with documentation and training data",
                  price: 150.0,
                  creatorName: "Dr. Emily Wilson",
                  creatorAvatar: "/images/creators/emily-wilson.jpg",
                  department: "Computer Science",
                  status: "in_progress",
                  createdAt: "2024-01-18",
                  deadline: "2024-01-30",
                  isCustomOrder: true,
                  requirements:
                    "Need a complete ML model with Python, scikit-learn, and comprehensive documentation",
                  milestones: [
                    {
                      id: "m1",
                      title: "Data Collection & Preprocessing",
                      description: "Gather and clean stock market data",
                      dueDate: "2024-01-22",
                      status: "completed",
                    },
                    {
                      id: "m2",
                      title: "Model Development",
                      description: "Develop and train the ML model",
                      dueDate: "2024-01-28",
                      status: "pending",
                    },
                  ],
                },
                {
                  id: "4",
                  clientId: userId,
                  creatorId: "creator-2",
                  title: "Business Strategy Analysis",
                  description:
                    "Comprehensive market entry strategy with competitive analysis",
                  price: 95.0,
                  creatorName: "Prof. Michael Davis",
                  creatorAvatar: "/images/creators/michael-davis.jpg",
                  department: "Business Administration",
                  status: "review",
                  createdAt: "2024-01-21",
                  deadline: "2024-01-29",
                  deliveryDate: "2024-01-24",
                  isCustomOrder: false,
                  deliverables: [
                    "Market analysis report",
                    "Competitive analysis",
                    "Entry strategy presentation",
                  ],
                },
              ];

        // Simulate API delay
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching active orders:", error);
        setLoading(false);
      }
    };

    if (userId && mounted) {
      fetchActiveOrders();
    }
  }, [userId, role, mounted]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
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

  const handleViewDetails = (order: Order) => {
    // TODO: Navigate to order details page
    console.log(`Viewing details for order ${order.id}`);
  };

  const handleUploadDeliverable = (order: Order) => {
    // TODO: Open file upload modal for creators
    console.log(`Uploading deliverable for order ${order.id}`);
  };

  const handleRequestRevision = (order: Order) => {
    // TODO: Open revision request modal for students
    console.log(`Requesting revision for order ${order.id}`);
  };

  const handleAcceptDelivery = (order: Order) => {
    // TODO: Accept delivery and complete order
    console.log(`Accepting delivery for order ${order.id}`);
  };

  const handleContactUser = (order: Order) => {
    const contactId = role === "creator" ? order.clientId : order.creatorId;
    if (contactId) {
      // Navigate to messages page with the contact's ID
      window.location.href = `/messages?user=${contactId}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Active Orders</h2>
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
              {role === "creator"
                ? "New orders will appear here when clients place them"
                : "Your orders will appear here once you make a purchase"}
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {order.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiUser className="w-4 h-4 mr-1" />
                    {role === "creator" ? order.clientName : order.creatorName}
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
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
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
