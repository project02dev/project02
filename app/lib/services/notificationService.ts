/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { Notification } from "@/types/messaging";

export class NotificationService {
  [x: string]: any;
  // Create a new notification
  async createNotification(
    userId: string,
    type:
      | "message"
      | "project_update"
      | "order"
      | "review"
      | "system"
      | "payment_received"
      | "payment_sent"
      | "project_purchased"
      | "earnings_available",
    title: string,
    message: string,
    data?: any
  ): Promise<string> {
    try {
      const notificationData = {
        userId,
        type,
        title,
        message,
        data: data || {},
        read: false,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "notifications"),
        notificationData
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Get notifications for a user
  getNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void,
    limitCount: number = 50
  ) {
    // Simplified query to avoid index requirements - we'll sort in memory
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      limit(limitCount * 2) // Get more to account for sorting
    );

    return onSnapshot(q, (snapshot) => {
      let notifications: Notification[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        readAt: doc.data().readAt?.toDate(),
      })) as Notification[];

      // Sort by createdAt in memory (newest first)
      notifications.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      // Limit to requested count
      if (notifications.length > limitCount) {
        notifications = notifications.slice(0, limitCount);
      }

      callback(notifications);
    });
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("read", "==", false)
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
          read: true,
          readAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "notifications", notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  // Get unread notification count
  getUnreadCount(userId: string, callback: (count: number) => void) {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("read", "==", false)
    );

    return onSnapshot(q, (snapshot) => {
      callback(snapshot.size);
    });
  }

  // Create message notification
  async createMessageNotification(
    recipientId: string,
    senderId: string,
    senderName: string,
    conversationId: string,
    messagePreview: string
  ): Promise<void> {
    try {
      await this.createNotification(
        recipientId,
        "message",
        `New message from ${senderName}`,
        messagePreview.length > 100
          ? messagePreview.substring(0, 100) + "..."
          : messagePreview,
        {
          conversationId,
          senderId,
          senderName,
        }
      );
    } catch (error) {
      console.error("Error creating message notification:", error);
    }
  }

  // Create project update notification
  async createProjectUpdateNotification(
    userId: string,
    projectId: string,
    projectTitle: string,
    updateType: string
  ): Promise<void> {
    try {
      await this.createNotification(
        userId,
        "project_update",
        "Project Update",
        `${projectTitle} has been ${updateType}`,
        {
          projectId,
          updateType,
        }
      );
    } catch (error) {
      console.error("Error creating project update notification:", error);
    }
  }

  // Create order notification
  async createOrderNotification(
    userId: string,
    orderId: string,
    orderType: "purchase" | "sale",
    projectTitle: string
  ): Promise<void> {
    try {
      const title =
        orderType === "purchase" ? "Purchase Confirmed" : "New Sale";
      const message =
        orderType === "purchase"
          ? `You have successfully purchased ${projectTitle}`
          : `Someone purchased your project: ${projectTitle}`;

      await this.createNotification(userId, "order", title, message, {
        orderId,
        orderType,
        projectTitle,
      });
    } catch (error) {
      console.error("Error creating order notification:", error);
    }
  }

  // Create review notification
  async createReviewNotification(
    creatorId: string,
    projectId: string,
    projectTitle: string,
    rating: number,
    reviewerName: string
  ): Promise<void> {
    try {
      await this.createNotification(
        creatorId,
        "review",
        "New Review",
        `${reviewerName} left a ${rating}-star review for ${projectTitle}`,
        {
          projectId,
          rating,
          reviewerName,
        }
      );
    } catch (error) {
      console.error("Error creating review notification:", error);
    }
  }

  // Delete old notifications (cleanup)
  async deleteOldNotifications(
    userId: string,
    daysOld: number = 30
  ): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("createdAt", "<", cutoffDate)
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error("Error deleting old notifications:", error);
    }
  }

  // Payment-specific notification methods
  async notifyPaymentReceived(
    creatorId: string,
    orderId: string,
    projectTitle: string,
    amount: number,
    currency: string,
    buyerName: string
  ): Promise<void> {
    if (!orderId || !creatorId) {
      console.error("Missing required fields for payment notification:", {
        orderId,
        creatorId,
      });
      return;
    }

    await this.createNotification(
      creatorId,
      "payment_received",
      "Payment Received! 💰",
      `You received a payment of ${currency} ${amount} for "${projectTitle}" from ${buyerName}`,
      {
        orderId,
        amount,
        currency,
        buyerName,
        projectTitle,
        actionUrl: `/dashboard?tab=sales`,
      }
    );
  }

  async notifyPaymentSent(
    buyerId: string,
    orderId: string,
    projectTitle: string,
    amount: number,
    currency: string,
    creatorName: string
  ): Promise<void> {
    if (!orderId || !buyerId) {
      console.error("Missing required fields for payment notification:", {
        orderId,
        buyerId,
      });
      return;
    }

    await this.createNotification(
      buyerId,
      "payment_sent",
      "Payment Successful! ✅",
      `Your payment of ${currency} ${amount} for "${projectTitle}" by ${creatorName} was successful`,
      {
        orderId,
        amount,
        currency,
        creatorName,
        projectTitle,
        actionUrl: `/dashboard?tab=purchases`,
      }
    );
  }

  async notifyProjectPurchased(
    creatorId: string,
    projectId: string,
    projectTitle: string,
    buyerName: string
  ): Promise<void> {
    await this.createNotification(
      creatorId,
      "project_purchased",
      "New Project Purchase! 🎉",
      `${buyerName} purchased your project "${projectTitle}"`,
      {
        projectId,
        projectTitle,
        buyerName,
        actionUrl: `/project/${projectId}`,
      }
    );
  }

  // Batch create notifications for payment completion
  async createPaymentNotifications(orderData: {
    orderId: string;
    projectId: string;
    projectTitle: string;
    buyerId: string;
    buyerName: string;
    creatorId: string;
    creatorName: string;
    amount: number;
    currency: string;
    netAmount: number;
  }): Promise<void> {
    try {
      console.log("Creating payment notifications for:", orderData);

      // Validate required fields
      if (!orderData.orderId || !orderData.buyerId || !orderData.creatorId) {
        console.error("Missing required fields for payment notifications:", {
          orderId: orderData.orderId,
          buyerId: orderData.buyerId,
          creatorId: orderData.creatorId,
        });
        return;
      }

      // Notify buyer
      await this.notifyPaymentSent(
        orderData.buyerId,
        orderData.orderId,
        orderData.projectTitle,
        orderData.amount,
        orderData.currency,
        orderData.creatorName
      );

      // Notify creator
      await this.notifyPaymentReceived(
        orderData.creatorId,
        orderData.orderId,
        orderData.projectTitle,
        orderData.netAmount,
        orderData.currency,
        orderData.buyerName
      );

      // Notify creator about project purchase
      await this.notifyProjectPurchased(
        orderData.creatorId,
        orderData.projectId,
        orderData.projectTitle,
        orderData.buyerName
      );

      console.log("Payment notifications created successfully");
    } catch (error) {
      console.error("Error creating payment notifications:", error);
    }
  }
}

export const notificationService = new NotificationService();
