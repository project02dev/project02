"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { notificationService } from "@/lib/services/notificationService";
import { Notification } from "@/types/messaging";
import Link from "next/link";
import {
  FiBell,
  FiMessageCircle,
  FiShoppingBag,
  FiStar,
  FiInfo,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import Header from "@/components/Header";

function getNotificationIcon(type: string) {
  switch (type) {
    case "message":
      return <FiMessageCircle className="w-5 h-5 text-blue-600" />;
    case "order":
      return <FiShoppingBag className="w-5 h-5 text-green-600" />;
    case "review":
      return <FiStar className="w-5 h-5 text-yellow-600" />;
    case "project_update":
      return <FiInfo className="w-5 h-5 text-purple-600" />;
    default:
      return <FiBell className="w-5 h-5 text-gray-600" />;
  }
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationsPage() {
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const unsubscribe = notificationService.getNotifications(
        user.uid,
        (fetched) => {
          setNotifications(fetched);
          setLoading(false);
        },
        100 // fetch up to 100 notifications
      );
      return () => unsubscribe();
    }
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-lg text-gray-600">
          Please log in to view notifications.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Your Notifications</h1>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FiBell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  !notification.read
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div>{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">
                      {notification.title}
                    </h2>
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{notification.message}</p>
                  {notification.data?.actionUrl && (
                    <Link
                      href={notification.data.actionUrl}
                      className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-center">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1 text-gray-400 hover:text-green-600"
                      title="Mark as read"
                    >
                      <FiCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete notification"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
