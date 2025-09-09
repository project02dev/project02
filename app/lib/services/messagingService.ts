/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import {
  Conversation,
  Message,
  Notification,
  TypingIndicator,
} from "@/types/messaging";

// Helper function to convert various date formats to Date
const convertToDate = (dateValue: any): Date | undefined => {
  if (!dateValue) return undefined;

  // If it's already a Date object
  if (dateValue instanceof Date) return dateValue;

  // If it's a Firestore Timestamp
  if (dateValue && typeof dateValue.toDate === "function") {
    return dateValue.toDate();
  }

  // If it's a string or number, try to parse it
  if (typeof dateValue === "string" || typeof dateValue === "number") {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }

  // If it has seconds property (Firestore Timestamp-like object)
  if (dateValue && typeof dateValue.seconds === "number") {
    return new Date(dateValue.seconds * 1000);
  }

  return undefined;
};

export class MessagingService {
  // Create a new conversation
  async createConversation(
    participantIds: string[],
    participantDetails: {
      [userId: string]: {
        name: string;
        avatar?: string;
        role: "student" | "creator";
      };
    }
  ): Promise<string> {
    try {
      const conversationData = {
        participants: participantIds,
        participantDetails,
        lastMessage: "",
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        unreadCount: participantIds.reduce(
          (acc, id) => ({ ...acc, [id]: 0 }),
          {}
        ),
        isActive: true,
      };

      const docRef = await addDoc(
        collection(db, "conversations"),
        conversationData
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  }

  // Get or create conversation between two users
  async getOrCreateConversation(
    user1Id: string,
    user2Id: string,
    userDetails: any
  ): Promise<string> {
    try {
      // Check if conversation already exists
      const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", user1Id)
      );

      const querySnapshot = await getDocs(q);

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        if (
          data.participants.includes(user2Id) &&
          data.participants.length === 2
        ) {
          return doc.id;
        }
      }

      // Create new conversation if none exists
      return await this.createConversation([user1Id, user2Id], userDetails);
    } catch (error) {
      console.error("Error getting or creating conversation:", error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
    type: "text" | "image" | "file" | "emoji" = "text",
    senderAvatar?: string,
    replyTo?: string
  ): Promise<string> {
    try {
      const messageData = {
        conversationId,
        senderId,
        senderName,
        senderAvatar: senderAvatar || "",
        content,
        type,
        timestamp: serverTimestamp(),
        edited: false,
        deleted: false,
        replyTo: replyTo || null,
        reactions: {},
        readBy: { [senderId]: serverTimestamp() },
      };

      const docRef = await addDoc(collection(db, "messages"), messageData);

      // Update conversation
      await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: content,
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update unread counts for other participants
      const conversationDoc = await getDoc(
        doc(db, "conversations", conversationId)
      );
      if (conversationDoc.exists()) {
        const conversationData = conversationDoc.data();
        const batch = writeBatch(db);

        conversationData.participants.forEach((participantId: string) => {
          if (participantId !== senderId) {
            batch.update(doc(db, "conversations", conversationId), {
              [`unreadCount.${participantId}`]: increment(1),
            });
          }
        });

        await batch.commit();
      }

      return docRef.id;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Get conversations for a user
  getConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
  ) {
    // Simplified query to avoid index requirements - we'll filter and sort in memory
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", userId)
    );

    return onSnapshot(q, (snapshot) => {
      let conversations: Conversation[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertToDate(data.createdAt) || new Date(),
          updatedAt: convertToDate(data.updatedAt) || new Date(),
          lastMessageAt: convertToDate(data.lastMessageAt),
        } as Conversation;
      });

      // Filter active conversations in memory
      conversations = conversations.filter((conv) => conv.isActive !== false);

      // Sort by lastMessageAt in memory
      conversations.sort((a, b) => {
        const aTime = a.lastMessageAt?.getTime() || 0;
        const bTime = b.lastMessageAt?.getTime() || 0;
        return bTime - aTime;
      });

      callback(conversations);
    });
  }

  // Get messages for a conversation
  getMessages(
    conversationId: string,
    callback: (messages: Message[]) => void,
    limitCount: number = 50
  ) {
    // Simplified query to avoid index requirements - we'll filter and sort in memory
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      limit(limitCount * 2) // Get more to account for filtering
    );

    return onSnapshot(q, (snapshot) => {
      let messages: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: convertToDate(data.timestamp) || new Date(),
          editedAt: convertToDate(data.editedAt),
          deletedAt: convertToDate(data.deletedAt),
          readBy: Object.entries(data.readBy || {}).reduce(
            (acc, [userId, timestamp]) => ({
              ...acc,
              [userId]: convertToDate(timestamp) || new Date(),
            }),
            {}
          ),
        } as Message;
      });

      // Filter out deleted messages in memory
      messages = messages.filter((msg) => !msg.deleted);

      // Sort by timestamp in memory (oldest first for chat display)
      messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // Limit to requested count (keep most recent)
      if (messages.length > limitCount) {
        messages = messages.slice(-limitCount);
      }

      callback(messages);
    });
  }

  // Mark messages as read
  async markMessagesAsRead(
    conversationId: string,
    userId: string
  ): Promise<void> {
    try {
      // Reset unread count
      await updateDoc(doc(db, "conversations", conversationId), {
        [`unreadCount.${userId}`]: 0,
      });

      // Mark all unread messages as read
      const q = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        where("senderId", "!=", userId)
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.docs.forEach((messageDoc) => {
        const messageData = messageDoc.data();
        if (!messageData.readBy || !messageData.readBy[userId]) {
          batch.update(messageDoc.ref, {
            [`readBy.${userId}`]: serverTimestamp(),
          });
        }
      });

      await batch.commit();
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  }

  // Add reaction to message
  async addReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<void> {
    try {
      await updateDoc(doc(db, "messages", messageId), {
        [`reactions.${emoji}`]: arrayUnion(userId),
      });
    } catch (error) {
      console.error("Error adding reaction:", error);
      throw error;
    }
  }

  // Remove reaction from message
  async removeReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<void> {
    try {
      await updateDoc(doc(db, "messages", messageId), {
        [`reactions.${emoji}`]: arrayRemove(userId),
      });
    } catch (error) {
      console.error("Error removing reaction:", error);
      throw error;
    }
  }

  // Delete message
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await updateDoc(doc(db, "messages", messageId), {
        deleted: true,
        deletedAt: serverTimestamp(),
        content: "This message was deleted",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  }

  // Edit message
  async editMessage(messageId: string, newContent: string): Promise<void> {
    try {
      await updateDoc(doc(db, "messages", messageId), {
        content: newContent,
        edited: true,
        editedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error editing message:", error);
      throw error;
    }
  }

  // Set typing indicator
  async setTyping(
    conversationId: string,
    userId: string,
    userName: string,
    isTyping: boolean
  ): Promise<void> {
    try {
      const typingRef = doc(db, "typing", `${conversationId}_${userId}`);

      if (isTyping) {
        await updateDoc(typingRef, {
          conversationId,
          userId,
          userName,
          timestamp: serverTimestamp(),
        });
      } else {
        await deleteDoc(typingRef);
      }
    } catch (error) {
      console.error("Error setting typing indicator:", error);
    }
  }

  // Get typing indicators
  getTypingIndicators(
    conversationId: string,
    currentUserId: string,
    callback: (indicators: TypingIndicator[]) => void
  ) {
    const q = query(
      collection(db, "typing"),
      where("conversationId", "==", conversationId)
    );

    return onSnapshot(q, (snapshot) => {
      const indicators: TypingIndicator[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            ...data,
            timestamp: convertToDate(data.timestamp) || new Date(),
          };
        })
        .filter(
          (indicator: any) => indicator.userId !== currentUserId
        ) as TypingIndicator[];

      callback(indicators);
    });
  }
}

export const messagingService = new MessagingService();
