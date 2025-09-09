/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FiMoreHorizontal,
  FiEdit3,
  FiTrash2,
  FiCornerUpLeft,
  FiPlay,
  FiPause,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { AudioPlayer, formatAudioDuration } from "@/lib/audio";
import { useTheme } from "../providers/ThemeProvider";

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

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  isLast?: boolean;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onReaction: (messageId: string, emoji: string) => void;
  onReply: (message: Message) => void;
  replyToMessage?: Message;
}

export default function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  isLast = true,
  onDelete,
  onEdit,
  onReaction,
  onReply,
  replyToMessage,
}: MessageBubbleProps) {
  const { actualTheme } = useTheme();
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  // Swipe gesture states
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const messageRef = useRef<HTMLDivElement>(null);

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleReactionClick = (emoji: string) => {
    onReaction(message.id, emoji);
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    // Only allow swipe to the right for reply (max 80px)
    if (diff > 0 && diff <= 80) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 40) {
      // Trigger reply if swiped more than 40px
      onReply(message);
    }

    setIsDragging(false);
    setSwipeOffset(0);
    setStartX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const diff = e.clientX - startX;

    // Only allow swipe to the right for reply (max 80px)
    if (diff > 0 && diff <= 80) {
      setSwipeOffset(diff);
    }
  };

  const handleMouseUp = () => {
    if (swipeOffset > 40) {
      // Trigger reply if swiped more than 40px
      onReply(message);
    }

    setIsDragging(false);
    setSwipeOffset(0);
    setStartX(0);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startX;
        if (diff > 0 && diff <= 80) {
          setSwipeOffset(diff);
        }
      };

      const handleGlobalMouseUp = () => {
        if (swipeOffset > 40) {
          onReply(message);
        }
        setIsDragging(false);
        setSwipeOffset(0);
        setStartX(0);
      };

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, startX, swipeOffset, onReply, message]);

  const initializeAudioPlayer = () => {
    if (message.type === "audio" && !audioPlayer) {
      const player = new AudioPlayer(
        (currentTime, duration) => {
          setAudioCurrentTime(currentTime);
          setAudioDuration(duration);
        },
        () => {
          setIsPlaying(false);
          setAudioCurrentTime(0);
        }
      );

      player.loadAudio(message.content);
      setAudioPlayer(player);
    }
  };

  const handlePlayPause = async () => {
    if (!audioPlayer) {
      initializeAudioPlayer();
      return;
    }

    try {
      if (isPlaying) {
        audioPlayer.pause();
        setIsPlaying(false);
      } else {
        await audioPlayer.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const renderMessageContent = () => {
    if (message.deleted) {
      return (
        <p className="text-gray-500 italic text-sm">This message was deleted</p>
      );
    }

    switch (message.type) {
      case "audio":
        return (
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3 max-w-xs">
            <button
              onClick={handlePlayPause}
              className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
            >
              {isPlaying ? (
                <FiPause className="w-4 h-4" />
              ) : (
                <FiPlay className="w-4 h-4 ml-0.5" />
              )}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-100"
                    style={{
                      width:
                        audioDuration > 0
                          ? `${(audioCurrentTime / audioDuration) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600">
                {formatAudioDuration(audioCurrentTime)} /{" "}
                {formatAudioDuration(audioDuration)}
              </p>
            </div>
          </div>
        );

      case "emoji":
        return <span className="text-3xl">{message.content}</span>;

      default:
        return (
          <div>
            {replyToMessage && (
              <div className="bg-gray-100 border-l-4 border-indigo-500 p-2 mb-2 rounded">
                <p className="text-xs text-gray-600 mb-1">Replying to:</p>
                <p className="text-sm text-gray-800">
                  {replyToMessage.content.substring(0, 100)}
                  {replyToMessage.content.length > 100 ? "..." : ""}
                </p>
              </div>
            )}

            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  rows={2}
                  autoFocus
                  placeholder="Edit your message..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiCheck className="w-3 h-3" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
          </div>
        );
    }
  };

  const renderReactions = () => {
    const reactions = Object.entries(message.reactions || {});
    if (reactions.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {reactions.map(([emoji, userIds]) => (
          <button
            key={emoji}
            onClick={() => handleReactionClick(emoji)}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
          >
            <span>{emoji}</span>
            <span className="text-gray-600">{userIds.length}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`flex ${
        isOwn ? "justify-end" : "justify-start"
      } group relative`}
    >
      {/* Reply indicator */}
      {swipeOffset > 0 && (
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 transition-opacity"
          style={{ opacity: Math.min(swipeOffset / 40, 1) }}
        >
          <FiCornerUpLeft className="w-5 h-5" />
        </div>
      )}

      <div
        ref={messageRef}
        className={`max-w-xs lg:max-w-md ${
          isOwn ? "order-2" : "order-1"
        } transition-transform`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className={`relative px-4 py-2 rounded-lg ${
            isOwn ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
          }`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {renderMessageContent()}

          {/* Message Actions */}
          {showActions && !message.deleted && (
            <div
              className={`absolute top-0 ${
                isOwn ? "left-0 -translate-x-full" : "right-0 translate-x-full"
              } flex items-center gap-1 bg-white shadow-lg rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              <button
                onClick={() => onReply(message)}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
                title="Reply"
              >
                <FiCornerUpLeft className="w-4 h-4" />
              </button>

              {/* Quick reactions */}
              <button
                onClick={() => handleReactionClick("👍")}
                className="p-1 hover:bg-gray-100 rounded"
                title="Like"
              >
                👍
              </button>
              <button
                onClick={() => handleReactionClick("❤️")}
                className="p-1 hover:bg-gray-100 rounded"
                title="Love"
              >
                ❤️
              </button>
              <button
                onClick={() => handleReactionClick("😂")}
                className="p-1 hover:bg-gray-100 rounded"
                title="Laugh"
              >
                😂
              </button>

              {isOwn && message.type === "text" && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  title="Edit"
                >
                  <FiEdit3 className="w-4 h-4" />
                </button>
              )}

              {isOwn && (
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-1 hover:bg-gray-100 rounded text-red-600"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Reactions */}
        {renderReactions()}

        {/* Timestamp and Edit indicator */}
        <div
          className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span>{formatTimestamp(message.timestamp)}</span>
          {message.edited && <span className="italic">edited</span>}
        </div>
      </div>
    </div>
  );
}
