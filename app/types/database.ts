/* eslint-disable @typescript-eslint/no-explicit-any */
// Enhanced database types for the complete system

export interface Order {
  id: string;
  projectId: string;
  projectTitle: string;
  projectThumbnail?: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  creatorId: string;
  creatorName: string;
  amount: number;
  currency: string;
  paymentMethod: "paystack" | "stripe" | "paypal" | "flutterwave";
  paymentReference: string;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  downloadUrl?: string;
  downloadCount: number;
  maxDownloads: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  metadata?: {
    paymentGatewayResponse?: any;
    userAgent?: string;
    ipAddress?: string;
  };
}

export interface Purchase {
  id: string;
  orderId: string;
  projectId: string;
  buyerId: string;
  createdAt: Date;
  accessGranted: boolean;
  downloadUrl?: string;
  downloadCount: number;
  lastDownloadAt?: Date;
  amount: number;
  currency: string;
  projectTitle: string;
}

export interface ProjectLike {
  id: string;
  projectId: string;
  userId: string;
  createdAt: Date;
}

export interface ProjectStats {
  projectId: string;
  totalLikes: number;
  totalPurchases: number;
  totalRevenue: number;
  totalViews: number;
  averageRating: number;
  totalReviews: number;
  lastUpdated: Date;
}

export interface PaymentMethod {
  id: string;
  name: string;
  provider: "paystack" | "stripe" | "paypal" | "flutterwave";
  isActive: boolean;
  supportedCurrencies: string[];
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  config: {
    publicKey?: string;
    webhookUrl?: string;
    [key: string]: any;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: "purchase" | "sale" | "message" | "like" | "review" | "system";
  title: string;
  message: string;
  data?: {
    orderId?: string;
    projectId?: string;
    conversationId?: string;
    senderId?: string;
    amount?: number;
    currency?: string;
    [key: string]: any;
  };
  read: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface DashboardStats {
  userId: string;
  role: "student" | "creator";
  totalSpent?: number; // For students
  totalPurchases?: number; // For students
  totalEarnings?: number; // For creators
  totalSales?: number; // For creators
  totalProjects?: number; // For creators
  totalLikes?: number; // For creators
  averageRating?: number; // For creators
  totalReviews?: number; // For creators
  monthlyEarnings?: { [month: string]: number }; // For creators
  monthlySpending?: { [month: string]: number }; // For students
  lastUpdated: Date;
}

export interface Review {
  id: string;
  projectId: string;
  orderId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean; // True if reviewer actually purchased the project
}

export interface ProjectView {
  id: string;
  projectId: string;
  userId?: string; // null for anonymous views
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  createdAt: Date;
}

export interface CreatorEarnings {
  id: string;
  creatorId: string;
  orderId: string;
  projectId: string;
  grossAmount: number;
  platformFee: number;
  paymentFee: number;
  netAmount: number;
  currency: string;
  status: "pending" | "available" | "paid";
  paidAt?: Date;
  createdAt: Date;
  paymentReference?: string;
}

export interface BankDetails {
  id: string;
  creatorId: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
  isVerified: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  verificationData?: {
    verifiedAt?: Date;
    verificationMethod?: string;
    verificationReference?: string;
  };
}

export interface Withdrawal {
  id: string;
  creatorId: string;
  amount: number;
  currency: string;
  method: "bank_transfer" | "paypal" | "mobile_money";
  bankDetailsId?: string;
  accountDetails: {
    accountNumber?: string;
    bankName?: string;
    accountName?: string;
    paypalEmail?: string;
    phoneNumber?: string;
  };
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  reference: string;
  processedAt?: Date;
  completedAt?: Date;
  failureReason?: string;
  adminNotes?: string;
  fees?: number;
  netAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  entityType: "project" | "user" | "order";
  entityId: string;
  event: "view" | "like" | "purchase" | "download" | "review";
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
}

// Enhanced Project interface
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  price: number;
  currency: string;
  department: string;
  category: string;
  subcategory?: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  thumbnailUrl?: string;
  previewImages?: string[];
  previewUrl?: string;
  downloadUrl?: string;
  fileSize?: number;
  fileFormat?: string;
  requirements?: string[];
  whatYouWillLearn?: string[];
  featured: boolean;
  status: "draft" | "published" | "suspended" | "deleted";

  // Stats (denormalized for performance)
  totalLikes: number;
  totalPurchases: number;
  totalViews: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;

  // SEO
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Enhanced User interface
export interface User {
  uid: string;
  fullName: string;
  username?: string;
  email: string;
  role: "student" | "creator" | "admin";
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

  // Stats
  rating?: number;
  reviewCount?: number;
  projectCount?: number;
  totalSales?: number;
  totalEarnings?: number;
  totalSpent?: number;
  totalPurchases?: number;

  // Status
  isOnline?: boolean;
  lastActive?: Date;
  verified: boolean;
  suspended: boolean;

  // Settings
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    messageNotifications: boolean;
    marketingEmails: boolean;
    currency: string;
    language: string;
  };

  // Payment info
  paymentMethods?: {
    paystack?: { customerCode: string };
    stripe?: { customerId: string };
    paypal?: { email: string };
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
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
