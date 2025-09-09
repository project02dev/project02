/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { messageService, userService } from "@/lib/database";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import EmojiPicker from "./EmojiPicker";
import {
  FiArrowLeft,
  FiMoreVertical,
  FiUser,
  FiImage,
  FiX,
} from "react-icons/fi";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "audio" | "emoji" | "image" | "file";
  replyTo?: string;
  timestamp: any;
  edited: boolean;
  deleted: boolean;
  reactions: Record<string, string[]>;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface ChatWindowProps {
  conversationId: string;
  onBack: () => void;
  onNewMessage: () => void;
  className?: string;
}

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export default function ChatWindow({
  conversationId,
  onBack,
  onNewMessage,
  className = "",
}: ChatWindowProps) {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    loadOtherUser();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const conversationMessages = await messageService.getMessages(
        conversationId
      );
      setMessages(conversationMessages as Message[]);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOtherUser = async () => {
    if (!user) return;

    try {
      // Get conversation to find other participant
      const conversations = await messageService.getUserConversations(user.uid);
      const conversation = conversations.find((c) => c.id === conversationId);

      if (conversation) {
        const otherUserId = conversation.participants.find(
          (id: string) => id !== user.uid
        );
        if (otherUserId) {
          const userInfo = await userService.getUser(otherUserId);
          if (userInfo) {
            setOtherUser({ id: otherUserId, ...userInfo } as UserInfo);
          }
        }
      }
    } catch (error) {
      console.error("Error loading other user:", error);
    }
  };

  const compressImage = (
    file: File,
    maxSizeKB: number = 500
  ): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const maxDimension = 1200;

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        const compress = (quality: number): void => {
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size <= maxSizeKB * 1024) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else if (quality > 0.1) {
                compress(quality - 0.1);
              } else {
                resolve(file); // Return original if can't compress enough
              }
            },
            "image/jpeg",
            quality
          );
        };

        compress(0.8);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleSendMessage = async (
    content: string,
    type: "text" | "audio" | "emoji" | "image" | "file" = "text",
    file?: File
  ) => {
    if (!user || (!content.trim() && !file)) return;

    let processedFile = file;

    // Compress image if it's too large
    if (file && file.type.startsWith("image/") && file.size > 500 * 1024) {
      processedFile = await compressImage(file);
    }

    try {
      const result = await messageService.sendMessage(
        conversationId,
        user.uid,
        content,
        type,
        replyingTo?.id,
        processedFile
      );

      if (result.success) {
        await loadMessages();
        onNewMessage();
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const result = await messageService.deleteMessage(messageId);
      if (result.success) {
        await loadMessages();
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const result = await messageService.editMessage(messageId, newContent);
      if (result.success) {
        await loadMessages();
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      await messageService.addReaction(messageId, user.uid, emoji);
      await loadMessages();
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleEmojiSelect = (emoji: string) => {
    handleSendMessage(emoji, "emoji");
    setShowEmojiPicker(false);
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-full bg-gray-50 ${className}`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Modern Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {otherUser?.avatar ? (
                <img
                  src={otherUser.avatar}
                  alt={otherUser.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                (otherUser?.fullName || otherUser?.email || "U")
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {otherUser?.fullName || otherUser?.email || "Unknown User"}
            </h3>
            <p className="text-sm text-gray-500">
              {isOnline ? "Online" : "Last seen recently"}
            </p>
          </div>

          <button className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100">
            <FiMoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
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
              No messages yet
            </h3>
            <p className="text-gray-500">
              Start the conversation with {otherUser?.fullName || "this user"}!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const showAvatar =
                index === 0 ||
                messages[index - 1].senderId !== message.senderId;
              const isLast =
                index === messages.length - 1 ||
                messages[index + 1].senderId !== message.senderId;

              return (
                <MessageBubble
                  key={message.id}
                  message={message as any}
                  isOwn={message.senderId === user?.uid}
                  showAvatar={showAvatar}
                  isLast={isLast}
                  onDelete={handleDeleteMessage}
                  onEdit={handleEditMessage}
                  onReaction={handleReaction}
                  onReply={handleReply}
                  replyToMessage={
                    message.replyTo
                      ? (messages.find((m) => m.id === message.replyTo) as any)
                      : undefined
                  }
                />
              );
            })}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {(otherUser?.fullName || otherUser?.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="bg-gray-50 border-t border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                Replying to: {replyingTo.content.substring(0, 50)}
                {replyingTo.content.length > 50 ? "..." : ""}
              </p>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="border-t border-gray-200">
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200">
        <MessageInput
          onSendMessage={handleSendMessage}
          onToggleEmoji={() => setShowEmojiPicker(!showEmojiPicker)}
          disabled={loading}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>
    </div>
  );
}
