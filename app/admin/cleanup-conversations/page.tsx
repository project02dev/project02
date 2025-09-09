/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { messageService } from "@/lib/database";

export default function CleanupConversationsPage() {
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCleanup = async () => {
    if (!user) return;

    setIsLoading(true);
    setResult(null);

    try {
      const cleanupResult = await messageService.cleanupDuplicateConversations(
        user.uid
      );
      setResult(cleanupResult);
    } catch (error) {
      console.error("Error during cleanup:", error);
      setResult({
        success: false,
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to access this page
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Cleanup Duplicate Conversations
          </h1>

          <div className="space-y-4">
            <p className="text-gray-600">
              This utility will remove duplicate conversations from your
              account. It will keep the most recent conversation for each unique
              set of participants.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-yellow-800 font-medium mb-2">⚠️ Warning</h3>
              <p className="text-yellow-700 text-sm">
                This action cannot be undone. Make sure you want to proceed with
                cleaning up duplicate conversations.
              </p>
            </div>

            <button
              onClick={handleCleanup}
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Cleaning up..." : "Cleanup Duplicate Conversations"}
            </button>

            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <h3
                  className={`font-medium mb-2 ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {result.success ? "✅ Cleanup Complete" : "❌ Cleanup Failed"}
                </h3>

                {result.success ? (
                  <div className="text-green-700 text-sm">
                    <p>Successfully cleaned up duplicate conversations.</p>
                    <p className="mt-1">
                      <strong>Deleted conversations:</strong>{" "}
                      {result.deletedCount || 0}
                    </p>
                    {result.deletedCount === 0 && (
                      <p className="mt-1 text-green-600">
                        No duplicate conversations found. Your conversations are
                        already clean!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-red-700 text-sm">
                    <p>
                      Error during cleanup: {result.error || "Unknown error"}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                How it works:
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Finds all conversations involving your account</li>
                <li>• Groups conversations by participant set</li>
                <li>
                  • For each group with duplicates, keeps the most recent
                  conversation
                </li>
                <li>• Deletes older duplicate conversations</li>
                <li>• Preserves all messages in the kept conversations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
