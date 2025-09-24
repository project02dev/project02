/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  addDoc,
  serverTimestamp,
  writeBatch,
  Query,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";

// User operations
export const userService = {
  async createUser(userId: string, userData: any) {
    try {
      await setDoc(doc(db, "users", userId), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async getUser(userId: string) {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as any;
      }
      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },

  async updateUser(userId: string, updates: any) {
    try {
      await updateDoc(doc(db, "users", userId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async getUserProfile(userId: string) {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  },

  async getCreatorStats(creatorId: string) {
    try {
      // Get basic stats from analytics
      const analytics = await analyticsService.getCreatorAnalytics(creatorId);

      // Get additional stats from projects and orders
      const projectsQuery = query(
        collection(db, "projects"),
        where("creatorId", "==", creatorId)
      );
      const projectsSnapshot = await getDocs(projectsQuery);

      const ordersQuery = query(
        collection(db, "orders"),
        where("creatorId", "==", creatorId),
        where("status", "==", "completed")
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      // Calculate ratings
      const reviews = await getDocs(
        query(collection(db, "reviews"), where("creatorId", "==", creatorId))
      );

      const ratings = reviews.docs
        .map((doc) => doc.data().rating)
        .filter((r) => r);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0;

      return {
        totalProjects: projectsSnapshot.size,
        totalSales: ordersSnapshot.size,
        totalEarnings: ordersSnapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().amount || 0),
          0
        ),
        averageRating,
        totalReviews: reviews.size,
        completionRate: 95, // Default completion rate
        responseTime: "< 1 hour", // Default response time
        repeatCustomers: Math.floor(ordersSnapshot.size * 0.3), // Estimate 30% repeat customers
      };
    } catch (error) {
      console.error("Error getting creator stats:", error);
      return {
        totalProjects: 0,
        totalSales: 0,
        totalEarnings: 0,
        averageRating: 0,
        totalReviews: 0,
        completionRate: 0,
        responseTime: "N/A",
        repeatCustomers: 0,
      };
    }
  },

  async getUserProjects(userId: string) {
    try {
      const projectsQuery = query(
        collection(db, "projects"),
        where("creatorId", "==", userId),
        where("status", "==", "active") // Only show active projects
      );
      const projectsSnapshot = await getDocs(projectsQuery);

      return projectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting user projects:", error);
      return [];
    }
  },
};

// Project operations
export const projectService = {
  async createProject(projectData: any) {
    try {
      const projectRef = await addDoc(collection(db, "projects"), {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
        totalSales: 0,
        rating: 0,
        reviewCount: 0,
      });
      return { success: true, id: projectRef.id };
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  async getProject(projectId: string) {
    try {
      const projectDoc = await getDoc(doc(db, "projects", projectId));
      if (projectDoc.exists()) {
        return { id: projectDoc.id, ...projectDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting project:", error);
      throw error;
    }
  },

  async getProjects(filters: any = {}) {
    try {
      // Start with a simple query that doesn't require composite indexes
      let q:
        | Query<DocumentData, DocumentData>
        | CollectionReference<DocumentData, DocumentData> = collection(
        db,
        "projects"
      );

      // For now, let's use a simple query and filter in memory to avoid index issues
      // This is not ideal for large datasets but works for getting started

      // Apply pagination first
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      } else {
        q = query(q, limit(50)); // Default limit to prevent large queries
      }

      const querySnapshot = await getDocs(q);
      let projects = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter in memory for now (not ideal for production but works for development)
      projects = projects.filter((project: any) => {
        // Always filter for active projects
        if (project.status !== "active") return false;

        // Apply other filters
        if (filters.department && project.department !== filters.department)
          return false;
        if (filters.difficulty && project.difficulty !== filters.difficulty)
          return false;
        if (filters.creatorId && project.creatorId !== filters.creatorId)
          return false;
        if (filters.featured && !project.featured) return false;

        return true;
      });

      // Sort in memory
      if (filters.sortBy) {
        const direction = filters.sortOrder === "desc" ? -1 : 1;
        projects.sort((a: any, b: any) => {
          const aVal = a[filters.sortBy];
          const bVal = b[filters.sortBy];

          if (filters.sortBy === "createdAt") {
            const aTime =
              aVal?.toDate?.()?.getTime() || new Date(aVal).getTime();
            const bTime =
              bVal?.toDate?.()?.getTime() || new Date(bVal).getTime();
            return (bTime - aTime) * direction;
          }

          if (typeof aVal === "number" && typeof bVal === "number") {
            return (bVal - aVal) * direction;
          }

          return String(bVal).localeCompare(String(aVal)) * direction;
        });
      } else {
        // Default sort by createdAt desc
        projects.sort((a: any, b: any) => {
          const aTime =
            a.createdAt?.toDate?.()?.getTime() ||
            new Date(a.createdAt).getTime();
          const bTime =
            b.createdAt?.toDate?.()?.getTime() ||
            new Date(b.createdAt).getTime();
          return bTime - aTime;
        });
      }

      return projects;
    } catch (error) {
      console.error("Error getting projects:", error);
      throw error;
    }
  },

  async updateProject(projectId: string, updates: any) {
    try {
      await updateDoc(doc(db, "projects", projectId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  async deleteProject(projectId: string) {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },
};

// Order operations
export const orderService = {
  async createOrder(orderData: any) {
    try {
      await setDoc(doc(db, "orders", orderData.id), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  async getOrder(orderId: string) {
    try {
      const orderDoc = await getDoc(doc(db, "orders", orderId));
      if (orderDoc.exists()) {
        return { id: orderDoc.id, ...orderDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting order:", error);
      throw error;
    }
  },

  async getUserOrders(userId: string) {
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return orders;
    } catch (error) {
      console.error("Error getting user orders:", error);
      throw error;
    }
  },

  async getCreatorOrders(creatorId: string) {
    try {
      const q = query(
        collection(db, "orders"),
        where("creatorId", "==", creatorId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return orders;
    } catch (error) {
      console.error("Error getting creator orders:", error);
      throw error;
    }
  },
};

// Review operations
export const reviewService = {
  async createReview(reviewData: any) {
    try {
      const reviewRef = await addDoc(collection(db, "reviews"), {
        ...reviewData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update project rating
      await this.updateProjectRating(reviewData.projectId);

      return { success: true, id: reviewRef.id };
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  async getProjectReviews(projectId: string) {
    try {
      const q = query(
        collection(db, "reviews"),
        where("projectId", "==", projectId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { rating?: number }),
      }));
      return reviews;
    } catch (error) {
      console.error("Error getting project reviews:", error);
      throw error;
    }
  },

  async updateProjectRating(projectId: string) {
    try {
      const reviews = await this.getProjectReviews(projectId);
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (sum, review) =>
            sum + (typeof review.rating === "number" ? review.rating : 0),
          0
        );
        const averageRating = totalRating / reviews.length;

        await updateDoc(doc(db, "projects", projectId), {
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          reviewCount: reviews.length,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error updating project rating:", error);
      throw error;
    }
  },
};

// Analytics operations
export const analyticsService = {
  async trackPageView(userId: string, page: string) {
    try {
      await addDoc(collection(db, "analytics"), {
        userId,
        page,
        timestamp: serverTimestamp(),
        type: "page_view",
      });
    } catch (error) {
      console.error("Error tracking page view:", error);
    }
  },

  async trackPurchase(userId: string, projectId: string, amount: number) {
    try {
      await addDoc(collection(db, "analytics"), {
        userId,
        projectId,
        amount,
        timestamp: serverTimestamp(),
        type: "purchase",
      });
    } catch (error) {
      console.error("Error tracking purchase:", error);
    }
  },

  async trackProjectView(userId: string, projectId: string, creatorId: string) {
    try {
      await addDoc(collection(db, "analytics"), {
        userId,
        projectId,
        creatorId,
        timestamp: serverTimestamp(),
        type: "project_view",
      });
    } catch (error) {
      console.error("Error tracking project view:", error);
    }
  },

  async trackProjectLike(
    userId: string,
    projectId: string,
    creatorId: string,
    liked: boolean
  ) {
    try {
      await addDoc(collection(db, "analytics"), {
        userId,
        projectId,
        creatorId,
        liked,
        timestamp: serverTimestamp(),
        type: "project_like",
      });
    } catch (error) {
      console.error("Error tracking project like:", error);
    }
  },

  async trackCreatorProfileView(userId: string, creatorId: string) {
    try {
      await addDoc(collection(db, "analytics"), {
        userId,
        creatorId,
        timestamp: serverTimestamp(),
        type: "creator_profile_view",
      });
    } catch (error) {
      console.error("Error tracking creator profile view:", error);
    }
  },

  async getProjectAnalytics(projectId: string) {
    try {
      const viewsQuery = query(
        collection(db, "analytics"),
        where("projectId", "==", projectId),
        where("type", "==", "project_view")
      );
      const likesQuery = query(
        collection(db, "analytics"),
        where("projectId", "==", projectId),
        where("type", "==", "project_like"),
        where("liked", "==", true)
      );

      const [viewsSnapshot, likesSnapshot] = await Promise.all([
        getDocs(viewsQuery),
        getDocs(likesQuery),
      ]);

      const views = viewsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          projectId: data.projectId,
          creatorId: data.creatorId,
          timestamp: data.timestamp?.toDate() || new Date(),
          type: data.type,
        };
      });

      const likes = likesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          projectId: data.projectId,
          creatorId: data.creatorId,
          liked: data.liked,
          timestamp: data.timestamp?.toDate() || new Date(),
          type: data.type,
        };
      });

      return {
        views,
        likes,
        totalViews: views.length,
        totalLikes: likes.length,
        uniqueViewers: [...new Set(views.map((v) => v.userId))].length,
        uniqueLikers: [...new Set(likes.map((l) => l.userId))].length,
      };
    } catch (error) {
      console.error("Error getting project analytics:", error);
      return {
        views: [],
        likes: [],
        totalViews: 0,
        totalLikes: 0,
        uniqueViewers: 0,
        uniqueLikers: 0,
      };
    }
  },

  async getCreatorAnalytics(creatorId: string) {
    try {
      const profileViewsQuery = query(
        collection(db, "analytics"),
        where("creatorId", "==", creatorId),
        where("type", "==", "creator_profile_view")
      );
      const projectViewsQuery = query(
        collection(db, "analytics"),
        where("creatorId", "==", creatorId),
        where("type", "==", "project_view")
      );
      const projectLikesQuery = query(
        collection(db, "analytics"),
        where("creatorId", "==", creatorId),
        where("type", "==", "project_like"),
        where("liked", "==", true)
      );

      const [profileViewsSnapshot, projectViewsSnapshot, projectLikesSnapshot] =
        await Promise.all([
          getDocs(profileViewsQuery),
          getDocs(projectViewsQuery),
          getDocs(projectLikesQuery),
        ]);

      const profileViews = profileViewsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          creatorId: data.creatorId,
          timestamp: data.timestamp?.toDate() || new Date(),
          type: data.type,
        };
      });

      const projectViews = projectViewsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          projectId: data.projectId,
          creatorId: data.creatorId,
          timestamp: data.timestamp?.toDate() || new Date(),
          type: data.type,
        };
      });

      const projectLikes = projectLikesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          projectId: data.projectId,
          creatorId: data.creatorId,
          liked: data.liked,
          timestamp: data.timestamp?.toDate() || new Date(),
          type: data.type,
        };
      });

      return {
        profileViews,
        projectViews,
        projectLikes,
        totalProfileViews: profileViews.length,
        totalProjectViews: projectViews.length,
        totalProjectLikes: projectLikes.length,
        uniqueProfileViewers: [...new Set(profileViews.map((v) => v.userId))]
          .length,
        uniqueProjectViewers: [...new Set(projectViews.map((v) => v.userId))]
          .length,
        uniqueProjectLikers: [...new Set(projectLikes.map((l) => l.userId))]
          .length,
      };
    } catch (error) {
      console.error("Error getting creator analytics:", error);
      return {
        profileViews: [],
        projectViews: [],
        projectLikes: [],
        totalProfileViews: 0,
        totalProjectViews: 0,
        totalProjectLikes: 0,
        uniqueProfileViewers: 0,
        uniqueProjectViewers: 0,
        uniqueProjectLikers: 0,
      };
    }
  },
};

// Messaging Service
export const messageService = {
  // Create a new conversation (with duplicate checking)
  async createConversation(participants: string[], projectId?: string) {
    try {
      // Check if conversation already exists between these participants
      const existingConversation = await this.findExistingConversation(
        participants,
        projectId
      );
      if (existingConversation) {
        return { success: true, id: existingConversation.id };
      }

      const conversationData = {
        participants,
        projectId: projectId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: null,
        lastMessageAt: null,
      };

      const docRef = await addDoc(
        collection(db, "conversations"),
        conversationData
      );
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error creating conversation:", error);
      return { success: false, error };
    }
  },

  // Find existing conversation between participants
  async findExistingConversation(participants: string[], projectId?: string) {
    try {
      // Query conversations that contain the first participant
      const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", participants[0])
      );

      const querySnapshot = await getDocs(q);

      // Check each conversation to see if it has exactly the same participants
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const convParticipants = data.participants || [];

        // Check if participants match exactly (same length and same members)
        if (
          convParticipants.length === participants.length &&
          participants.every((p) => convParticipants.includes(p))
        ) {
          // If projectId is specified, make sure it matches
          if (projectId !== undefined) {
            if (data.projectId === projectId) {
              return { id: doc.id, ...data };
            }
          } else {
            // If no projectId specified, return any matching conversation
            return { id: doc.id, ...data };
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Error finding existing conversation:", error);
      return null;
    }
  },

  // Send a message
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType: string,
    id: string | undefined,
    processedFile: File | undefined,
    contentType: "text" | "audio" | "emoji" = "text",
    replyTo?: string
  ) {
    try {
      const messageData = {
        conversationId,
        senderId,
        content,
        type: messageType,
        contentType,
        replyTo: replyTo || null,
        timestamp: serverTimestamp(),
        edited: false,
        deleted: false,
        reactions: {},
      };

      const docRef = await addDoc(collection(db, "messages"), messageData);

      // Update conversation with last message
      await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: content,
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error sending message:", error);
      return { success: false, error };
    }
  },

  // Get conversations for a user (with duplicate filtering)
  async getUserConversations(userId: string) {
    try {
      const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", userId),
        orderBy("updatedAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const conversations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // Filter out duplicate conversations (same participants)
      const uniqueConversations = [];
      const seenParticipantSets = new Set();

      for (const conv of conversations) {
        // Create a unique key for this participant set
        const participants = conv.participants || [];
        const participantKey = [...participants].sort().join(",");
        const fullKey = conv.projectId
          ? `${participantKey}:${conv.projectId}`
          : participantKey;

        if (!seenParticipantSets.has(fullKey)) {
          seenParticipantSets.add(fullKey);
          uniqueConversations.push(conv);
        }
      }

      return uniqueConversations;
    } catch (error) {
      console.error("Error getting conversations:", error);
      throw error;
    }
  },

  // Clean up duplicate conversations (utility method)
  async cleanupDuplicateConversations(userId: string) {
    try {
      const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", userId)
      );

      const querySnapshot = await getDocs(q);
      const conversations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // Group conversations by participant set
      const conversationGroups = new Map();

      for (const conv of conversations) {
        const participants = conv.participants || [];
        const participantKey = [...participants].sort().join(",");
        const fullKey = conv.projectId
          ? `${participantKey}:${conv.projectId}`
          : participantKey;

        if (!conversationGroups.has(fullKey)) {
          conversationGroups.set(fullKey, []);
        }
        conversationGroups.get(fullKey).push(conv);
      }

      // Delete duplicates (keep the most recent one)
      const batch = writeBatch(db);
      let deletionCount = 0;

      for (const [, convGroup] of conversationGroups) {
        if (convGroup.length > 1) {
          // Sort by updatedAt and keep the most recent
          convGroup.sort((a: any, b: any) => {
            const aTime = a.updatedAt?.toDate?.()?.getTime() || 0;
            const bTime = b.updatedAt?.toDate?.()?.getTime() || 0;
            return bTime - aTime;
          });

          // Delete all but the first (most recent)
          for (let i = 1; i < convGroup.length; i++) {
            batch.delete(doc(db, "conversations", convGroup[i].id));
            deletionCount++;
          }
        }
      }

      if (deletionCount > 0) {
        await batch.commit();
        console.log(`Cleaned up ${deletionCount} duplicate conversations`);
      }

      return { success: true, deletedCount: deletionCount };
    } catch (error) {
      console.error("Error cleaning up duplicate conversations:", error);
      return { success: false, error };
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId: string, limitCount: number = 50) {
    try {
      const q = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        where("deleted", "==", false),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return messages.reverse(); // Show oldest first
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  },

  // Delete a message
  async deleteMessage(messageId: string) {
    try {
      await updateDoc(doc(db, "messages", messageId), {
        deleted: true,
        content: "This message was deleted",
        deletedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error deleting message:", error);
      return { success: false, error };
    }
  },

  // Edit a message
  async editMessage(messageId: string, newContent: string) {
    try {
      await updateDoc(doc(db, "messages", messageId), {
        content: newContent,
        edited: true,
        editedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error editing message:", error);
      return { success: false, error };
    }
  },

  // Add reaction to message
  async addReaction(messageId: string, userId: string, emoji: string) {
    try {
      const messageRef = doc(db, "messages", messageId);
      const messageDoc = await getDoc(messageRef);

      if (messageDoc.exists()) {
        const data = messageDoc.data();
        const reactions = data.reactions || {};

        if (!reactions[emoji]) {
          reactions[emoji] = [];
        }

        if (!reactions[emoji].includes(userId)) {
          reactions[emoji].push(userId);
        }

        await updateDoc(messageRef, { reactions });
      }

      return { success: true };
    } catch (error) {
      console.error("Error adding reaction:", error);
      return { success: false, error };
    }
  },

  // Block a user
  async blockUser(blockerId: string, blockedId: string) {
    try {
      await addDoc(collection(db, "blocks"), {
        blockerId,
        blockedId,
        createdAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error blocking user:", error);
      return { success: false, error };
    }
  },

  // Check if user is blocked
  async isUserBlocked(userId1: string, userId2: string) {
    try {
      const q1 = query(
        collection(db, "blocks"),
        where("blockerId", "==", userId1),
        where("blockedId", "==", userId2)
      );

      const q2 = query(
        collection(db, "blocks"),
        where("blockerId", "==", userId2),
        where("blockedId", "==", userId1)
      );

      const [snapshot1, snapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2),
      ]);

      return !snapshot1.empty || !snapshot2.empty;
    } catch (error) {
      console.error("Error checking if user is blocked:", error);
      return false;
    }
  },
};

// Featured Projects
export async function getFeaturedProjects() {
  const q = query(
    collection(db, "projects"),
    where("featured", "==", true),
    orderBy("createdAt", "desc"),
    limit(6)
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
