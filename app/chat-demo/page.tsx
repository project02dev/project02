"use client";

import React, { useState } from 'react';
import ChatWindow from '@/components/messaging/ChatWindow';
import { ThemeToggle } from '@/components/providers/ThemeProvider';
import SystemStatus from '@/components/ui/SystemStatus';

export default function ChatDemoPage() {
  const [selectedConversation, setSelectedConversation] = useState('demo-conversation');
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const conversations = [
    {
      id: 'demo-conversation',
      name: 'Jerome White',
      lastMessage: 'Hey, how are you doing?',
      timestamp: '2 min ago',
      unread: 2,
      avatar: null,
      isOnline: true
    },
    {
      id: 'demo-conversation-2',
      name: 'Madagascar Silver',
      lastMessage: 'Thanks for the project files!',
      timestamp: '5 min ago',
      unread: 0,
      avatar: null,
      isOnline: false
    },
    {
      id: 'demo-conversation-3',
      name: 'Pippins McGray',
      lastMessage: 'Can we schedule a meeting?',
      timestamp: '1 hour ago',
      unread: 1,
      avatar: null,
      isOnline: true
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Chat Demo - Modern UI
          </h1>
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ☰
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Dark/Light Mode Toggle
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarVisible ? 'w-80' : 'w-0'} ${sidebarVisible ? 'block' : 'hidden'} md:block md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
          </div>
          
          <div className="overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {conversation.name.charAt(0)}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <ChatWindow
              conversationId={selectedConversation}
              onBack={() => setSidebarVisible(true)}
              onNewMessage={() => console.log('New message')}
              className="flex-1"
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a conversation from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Status Footer */}
      <SystemStatus />
    </div>
  );
}
