/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Conversation {
  id: string;
  participants: string[]; // Array of user IDs
  participantDetails: {
    [userId: string]: {
      name: string;
      avatar?: string;
      role: "student" | "creator";
    };
  };
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  unreadCount: {
    [userId: string]: number;
  };
  isActive: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: "text" | "image" | "file" | "emoji";
  timestamp: Date;
  edited: boolean;
  editedAt?: Date;
  deleted: boolean;
  deletedAt?: Date;
  replyTo?: string; // Message ID being replied to
  reactions: {
    [emoji: string]: string[]; // Array of user IDs who reacted
  };
  readBy: {
    [userId: string]: Date;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: "message" | "project_update" | "order" | "review" | "system";
  title: string;
  message: string;
  data?: {
    conversationId?: string;
    projectId?: string;
    orderId?: string;
    senderId?: string;
    [key: string]: any;
  };
  read: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  username?: string;
  email: string;
  role: "student" | "creator";
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  skills?: string[];
  workExperience?: WorkExperience[];
  education?: Education[];
  rating?: number;
  reviewCount?: number;
  projectCount?: number;
  totalSales?: number;
  joinedAt: Date;
  lastActive?: Date;
  isOnline?: boolean;
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    messageNotifications: boolean;
  };
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  field?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface CreatorStats {
  totalProjects: number;
  totalSales: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  responseTime: string; // e.g., "Usually responds within 2 hours"
  completionRate: number;
  repeatCustomers: number;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  timestamp: Date;
}
