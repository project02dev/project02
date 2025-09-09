/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiSmile,
  FiPaperclip,
  FiMic,
  FiX,
  FiImage,
} from "react-icons/fi";
import { useTheme } from "../providers/ThemeProvider";

interface MessageInputProps {
  onSendMessage: (
    content: string,
    type?: "text" | "audio" | "emoji" | "image" | "file",
    file?: File
  ) => void;
  onToggleEmoji: () => void;
  disabled?: boolean;
  replyingTo?: any;
  onCancelReply?: () => void;
}

export default function MessageInput({
  onSendMessage,
  onToggleEmoji,
  disabled = false,
  replyingTo,
  onCancelReply,
}: MessageInputProps) {
  const { actualTheme } = useTheme();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if ((!message.trim() && !selectedFile) || disabled) return;

    const messageType = selectedFile
      ? selectedFile.type.startsWith("image/")
        ? "image"
        : "file"
      : "text";

    onSendMessage(message.trim() || "", messageType, selectedFile || undefined);
    setMessage("");
    setSelectedFile(null);
    setFilePreview(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleVoiceRecord = () => {
    // TODO: Implement voice recording
    setIsRecording(!isRecording);
    console.log("Voice record clicked");
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />
      <input
        ref={imageInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
      />

      {/* File Preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <FiPaperclip className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Reply Preview */}
      {replyingTo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-blue-600 mb-1 font-medium">
                Replying to:
              </p>
              <p className="text-sm text-gray-700 line-clamp-2">
                {replyingTo.content}
              </p>
            </div>
            {onCancelReply && (
              <button
                onClick={onCancelReply}
                className="text-blue-400 hover:text-blue-600 ml-2 p-1 rounded-lg hover:bg-blue-100"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Image Upload Button */}
        <button
          onClick={handleImageUpload}
          className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors"
          title="Upload image"
        >
          <FiImage className="w-5 h-5" />
        </button>

        {/* File Attachment Button */}
        <button
          onClick={handleFileUpload}
          className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors"
          title="Attach file"
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        {/* Text Input Container */}
        <div className="flex-1 relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-500 transition-colors">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none bg-transparent px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed max-h-32 overflow-y-auto"
            style={{ minHeight: "48px" }}
          />
        </div>

        {/* Emoji Button */}
        <button
          onClick={onToggleEmoji}
          className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors"
          title="Add emoji"
        >
          <FiSmile className="w-5 h-5" />
        </button>

        {/* Voice/Send Button */}
        {message.trim() || selectedFile ? (
          <button
            onClick={handleSend}
            disabled={disabled}
            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
            title="Send message"
          >
            <FiSend className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleVoiceRecord}
            className={`p-2.5 rounded-xl transition-colors ${
              isRecording
                ? "bg-red-600 text-white hover:bg-red-700 shadow-lg"
                : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
            }`}
            title={isRecording ? "Stop recording" : "Record voice message"}
          >
            <FiMic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
