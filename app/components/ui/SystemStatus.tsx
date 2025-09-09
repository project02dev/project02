/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../providers/ThemeProvider";

interface SystemStatusProps {
  className?: string;
}

type SystemHealth = "healthy" | "warning" | "error" | "maintenance";

interface StatusData {
  health: SystemHealth;
  message: string;
  lastUpdated: Date;
  uptime: string;
  activeUsers: number;
  serverLoad: number;
}

export function SystemStatus({ className = "" }: SystemStatusProps) {
  const { actualTheme } = useTheme();
  const [status, setStatus] = useState<StatusData>({
    health: "healthy",
    message: "All systems operational",
    lastUpdated: new Date(),
    uptime: "99.9%",
    activeUsers: 0,
    serverLoad: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      setStatus((prev) => ({
        ...prev,
        lastUpdated: new Date(),
        activeUsers: Math.floor(Math.random() * 100) + 50,
        serverLoad: Math.floor(Math.random() * 30) + 10,
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (health: SystemHealth) => {
    switch (health) {
      case "healthy":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      case "maintenance":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (health: SystemHealth) => {
    switch (health) {
      case "healthy":
        return "●";
      case "warning":
        return "⚠";
      case "error":
        return "●";
      case "maintenance":
        return "🔧";
      default:
        return "●";
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${getStatusColor(status.health)}`}>
                {getStatusIcon(status.health)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {status.message}
              </span>
            </div>

            {isExpanded && (
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Uptime: {status.uptime}</span>
                <span>Users: {status.activeUsers}</span>
                <span>Load: {status.serverLoad}%</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Updated {status.lastUpdated.toLocaleTimeString()}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {isExpanded ? "▼" : "▲"}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">
                  Database
                </span>
                <span className="text-green-500 font-medium">Operational</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">API</span>
                <span className="text-green-500 font-medium">Operational</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">
                  Storage
                </span>
                <span className="text-green-500 font-medium">Operational</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">CDN</span>
                <span className="text-green-500 font-medium">Operational</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemStatus;
