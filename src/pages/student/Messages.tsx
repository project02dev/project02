
import React, { useState } from 'react'
import { Send, Search, MoreVertical, Paperclip, Smile } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'

export const Messages = () => {
  const [selectedChat, setSelectedChat] = useState('1')
  const [newMessage, setNewMessage] = useState('')

  const conversations = [
    {
      id: '1',
      creator: {
        name: 'webdev_pro',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        status: 'online'
      },
      lastMessage: 'Sure, I can make those changes for you.',
      timestamp: '2 min ago',
      unread: 2,
      project: 'React E-commerce Website'
    },
    {
      id: '2',
      creator: {
        name: 'db_expert',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        status: 'offline'
      },
      lastMessage: 'The database schema is ready for review.',
      timestamp: '1 hour ago',
      unread: 0,
      project: 'Database Design Project'
    },
    {
      id: '3',
      creator: {
        name: 'ui_designer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a09e8c?w=100&h=100&fit=crop',
        status: 'online'
      },
      lastMessage: 'Thank you for the feedback!',
      timestamp: '3 hours ago',
      unread: 0,
      project: 'Mobile App UI Design'
    }
  ]

  const messages = [
    {
      id: '1',
      sender: 'student',
      content: 'Hi! I just purchased your React e-commerce project. Could you help me with the setup?',
      timestamp: '10:30 AM',
      type: 'text'
    },
    {
      id: '2',
      sender: 'creator',
      content: 'Hello! Welcome and thank you for your purchase. I\'d be happy to help you with the setup.',
      timestamp: '10:32 AM',
      type: 'text'
    },
    {
      id: '3',
      sender: 'creator',
      content: 'I\'ve attached a detailed setup guide. Let me know if you need any clarification.',
      timestamp: '10:33 AM',
      type: 'file',
      fileName: 'setup-guide.pdf'
    },
    {
      id: '4',
      sender: 'student',
      content: 'Thanks! I\'ve reviewed the guide. Could you also help me customize the color scheme?',
      timestamp: '11:15 AM',
      type: 'text'
    },
    {
      id: '5',
      sender: 'creator',
      content: 'Sure, I can make those changes for you.',
      timestamp: '11:45 AM',
      type: 'text'
    }
  ]

  const selectedConversation = conversations.find(conv => conv.id === selectedChat)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle message sending
      setNewMessage('')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Communicate with project creators</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 border-b ${
                    selectedChat === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedChat(conversation.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.creator.avatar} />
                          <AvatarFallback>{conversation.creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                          conversation.creator.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{conversation.creator.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.project}
                        </p>
                      </div>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="bg-primary text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {conversation.lastMessage}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {conversation.timestamp}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.creator.avatar} />
                      <AvatarFallback>{selectedConversation.creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedConversation.creator.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.project}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${
                      message.sender === 'student' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    } rounded-lg p-3`}>
                      {message.type === 'file' ? (
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">{message.fileName}</span>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.sender === 'student' 
                          ? 'text-primary-foreground/80' 
                          : 'text-muted-foreground'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
