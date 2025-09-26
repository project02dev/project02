/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { messageService } from "@/lib/database";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { FiMessageCircle, FiX } from "react-icons/fi";

interface Conversation {
  id: string;
  participants: string[];
  projectId?: string;
  lastMessage?: string;
  lastMessageAt?: any;
  updatedAt?: any;
}

interface MessageCenterProps {
  projectId?: string;
  targetUserId?: string;
  className?: string;
  isFullPage?: boolean;
}

export default function MessageCenter({
  projectId,
  targetUserId,
  className = "",
  isFullPage = false,
}: MessageCenterProps) {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(isFullPage);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && (isOpen || isFullPage)) {
      loadConversations();
    }
  }, [user, isOpen, isFullPage]);

  useEffect(() => {
    // Auto-open conversation if targetUserId is provided
    if (targetUserId && user && (isOpen || isFullPage)) {
      handleStartConversation(targetUserId, projectId);
    }
  }, [targetUserId, user, isOpen, isFullPage, projectId]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Clean up any duplicate conversations first
      await messageService.cleanupDuplicateConversations(user.uid);

      // Then load the cleaned conversations
      const userConversations = await messageService.getUserConversations(
        user.uid
      );
      setConversations(userConversations as Conversation[]);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async (
    otherUserId: string,
    projectId?: string
  ) => {
    if (!user) return;

    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(
        (conv) =>
          conv.participants.includes(otherUserId) &&
          conv.participants.includes(user.uid) &&
          conv.participants.length === 2 &&
          (!projectId || conv.projectId === projectId)
      );

      if (existingConversation) {
        setSelectedConversation(existingConversation.id);
        return;
      }

      // Create new conversation
      const result = await messageService.createConversation(
        [user.uid, otherUserId],
        projectId
      );

      if (result.success && result.id) {
        setSelectedConversation(result.id);
        await loadConversations(); // Refresh conversations list
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const handleNewMessage = () => {
    // Refresh conversations when a new message is sent
    loadConversations();
  };

  if (!user) {
    return null;
  }

  if (isFullPage) {
    // Full-page mode for dedicated messages page
    return (
      <div className={`h-full flex flex-col bg-white ${className}`}>
        {/* Header - fixed height, non-scrolling */}
        <div className="shrink-0 bg-white border-b border-gray-100 p-4"></div>

        {/* Body must own the only scroll; lock container height */}
        <div className="min-h-0 flex-1 flex overflow-hidden">
          {/* Sidebar - Always visible on desktop, toggleable on mobile */}
          <div
            className={`${
              selectedConversation ? "hidden md:block" : "block"
            } w-full md:w-80 bg-white border-r border-gray-100 overflow-y-auto`}
          >
            <ConversationList
              conversations={conversations}
              loading={loading}
              onConversationSelect={handleConversationSelect}
              onRefresh={loadConversations}
              className="h-full"
            />
          </div>

          {/* Chat Area owns scroll inside ChatWindow */}
          <div
            className={`${
              selectedConversation ? "block" : "hidden md:block"
            } flex-1 min-w-0 flex flex-col overflow-hidden`}
          >
            {selectedConversation ? (
              <ChatWindow
                conversationId={selectedConversation}
                onBack={handleBackToList}
                onNewMessage={handleNewMessage}
                className="flex-1 min-h-0"
              />
            ) : (
              <div className="flex-1 min-h-0 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the sidebar to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Message Center Toggle Button - green brand */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 primary-green primary-green-hover text-white rounded-full p-4 shadow-lg transition-transform duration-200 hover:scale-105"
        aria-label="Open messages"
        aria-pressed={isOpen}
      >
        {isOpen ? (
          <FiX className="w-6 h-6" />
        ) : (
          <FiMessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Message Center Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-end p-4">
          {/* Backdrop locks body scroll */}
          <div
            className="absolute inset-0 bg-black bg-opacity-25"
            onClick={() => setIsOpen(false)}
          />

          {/* Message Center Window */}
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md h-96 md:h-[500px] flex flex-col overflow-hidden">
            {/* Header (non-scrolling) */}
            <div className="shrink-0 primary-green text-white p-4 flex items-center justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close messages"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content owns scroll; avoid modal outer scrolling */}
            <div className="min-h-0 flex-1 flex overflow-hidden">
              {selectedConversation ? (
                <ChatWindow
                  conversationId={selectedConversation}
                  onBack={handleBackToList}
                  onNewMessage={handleNewMessage}
                  className="w-full min-h-0"
                />
              ) : (
                <div className="w-full overflow-y-auto">
                  <ConversationList
                    conversations={conversations}
                    loading={loading}
                    onConversationSelect={handleConversationSelect}
                    onRefresh={loadConversations}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
