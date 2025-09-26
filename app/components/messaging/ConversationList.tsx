/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { userService } from "@/lib/database";
import { FiRefreshCw, FiMessageCircle, FiUser } from "react-icons/fi";

interface Conversation {
  id: string;
  participants: string[];
  projectId?: string;
  lastMessage?: string;
  lastMessageAt?: any;
  updatedAt?: any;
}

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  onConversationSelect: (conversationId: string) => void;
  onRefresh: () => void;
  className?: string;
}

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export default function ConversationList({
  conversations,
  loading,
  onConversationSelect,
  onRefresh,
  className = "",
}: ConversationListProps) {
  const [user] = useAuthState(auth);
  const [userInfos, setUserInfos] = useState<Record<string, UserInfo>>({});

  useEffect(() => {
    loadUserInfos();
  }, [conversations]);

  const loadUserInfos = async () => {
    if (!user) return;

    const userIds = new Set<string>();
    conversations.forEach((conv) => {
      conv.participants.forEach((participantId) => {
        if (participantId !== user.uid) {
          userIds.add(participantId);
        }
      });
    });

    const userInfoPromises = Array.from(userIds).map(async (userId) => {
      try {
        const userInfo = await userService.getUser(userId);
        return userInfo ? { id: userId, ...userInfo } : null;
      } catch (error) {
        console.error("Error loading user info:", error);
        return null;
      }
    });

    const userInfoResults = await Promise.all(userInfoPromises);
    const userInfoMap: Record<string, UserInfo> = {};

    userInfoResults.forEach((userInfo) => {
      if (userInfo) {
        userInfoMap[userInfo.id] = userInfo;
      }
    });

    setUserInfos(userInfoMap);
  };

  const getOtherParticipant = (conversation: Conversation): UserInfo | null => {
    if (!user) return null;

    const otherParticipantId = conversation.participants.find(
      (id) => id !== user.uid
    );
    return otherParticipantId ? userInfos[otherParticipantId] || null : null;
  };

  const formatLastMessageTime = (timestamp: any): string => {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    }
  };

  const truncateMessage = (message: string, maxLength: number = 50): string => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-full bg-white ${className}`}
      >
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 animate-spin text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-full p-6 bg-white ${className}`}
      >
        <FiMessageCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No conversations yet
        </h3>
        <p className="text-gray-500 text-center mb-4">
          Start a conversation by messaging a project creator or student.
        </p>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 btn-primary hover:primary-green-hover transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Conversations</h3>
        <button
          onClick={onRefresh}
          className="text-gray-400 hover:text-green-700 transition-colors"
          aria-label="Refresh conversations"
        >
          <FiRefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);

          return (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect(conversation.id)}
              className="p-4 border-b border-gray-100 hover:bg-green-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0 relative">
                  <div className="w-12 h-12 primary-green rounded-full flex items-center justify-center text-white font-semibold">
                    {otherParticipant?.avatar ? (
                      <img
                        src={otherParticipant.avatar}
                        alt={otherParticipant.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      (
                        otherParticipant?.fullName ||
                        otherParticipant?.email ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {otherParticipant?.fullName ||
                        otherParticipant?.email ||
                        "Unknown User"}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatLastMessageTime(conversation.lastMessageAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {truncateMessage(conversation.lastMessage)}
                      </p>
                    )}
                  </div>

                  {conversation.projectId && (
                    <p className="text-xs text-green-700 mt-1">
                      📁 Project conversation
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
