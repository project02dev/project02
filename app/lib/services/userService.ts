/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  UserProfile,
  CreatorStats,
  WorkExperience,
  Education,
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

export class UserService {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();

        return {
          uid: userDoc.id,
          ...data,
          joinedAt: convertToDate(data.createdAt) || new Date(),
          lastActive: convertToDate(data.lastActive),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await updateDoc(doc(db, "users", userId), updateData);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Get all creators with pagination
  async getCreators(
    limitCount: number = 20,
    lastDoc?: any,
    filters?: {
      skills?: string[];
      rating?: number;
      location?: string;
      searchQuery?: string;
    }
  ): Promise<{ creators: UserProfile[]; lastDoc: any }> {
    try {
      let q = query(
        collection(db, "users"),
        where("role", "==", "creator"),
        orderBy("rating", "desc"),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);

      const creators: UserProfile[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          ...data,
          joinedAt: convertToDate(data.createdAt) || new Date(),
          lastActive: convertToDate(data.lastActive),
        } as UserProfile;
      });

      // Apply client-side filters if needed
      let filteredCreators = creators;

      if (filters?.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        filteredCreators = filteredCreators.filter(
          (creator) =>
            creator.fullName.toLowerCase().includes(searchLower) ||
            creator.bio?.toLowerCase().includes(searchLower) ||
            creator.skills?.some((skill) =>
              skill.toLowerCase().includes(searchLower)
            )
        );
      }

      if (filters?.skills && filters.skills.length > 0) {
        filteredCreators = filteredCreators.filter((creator) =>
          creator.skills?.some((skill) =>
            filters.skills!.some((filterSkill) =>
              skill.toLowerCase().includes(filterSkill.toLowerCase())
            )
          )
        );
      }

      if (filters?.rating) {
        filteredCreators = filteredCreators.filter(
          (creator) => (creator.rating || 0) >= filters.rating!
        );
      }

      if (filters?.location) {
        filteredCreators = filteredCreators.filter((creator) =>
          creator.location
            ?.toLowerCase()
            .includes(filters.location!.toLowerCase())
        );
      }

      return {
        creators: filteredCreators,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
      };
    } catch (error) {
      console.error("Error getting creators:", error);
      throw error;
    }
  }

  // Get creator statistics
  async getCreatorStats(creatorId: string): Promise<CreatorStats> {
    try {
      // Get projects count and stats
      const projectsQuery = query(
        collection(db, "projects"),
        where("creatorId", "==", creatorId)
      );
      const projectsSnapshot = await getDocs(projectsQuery);

      let totalSales = 0;
      let totalEarnings = 0;
      let totalRating = 0;
      let totalReviews = 0;

      projectsSnapshot.docs.forEach((doc) => {
        const project = doc.data();
        totalSales += project.totalSales || 0;
        totalEarnings += project.earnings || 0;
        if (project.rating && project.reviewCount) {
          totalRating += project.rating * project.reviewCount;
          totalReviews += project.reviewCount;
        }
      });

      // Get orders for completion rate
      const ordersQuery = query(
        collection(db, "orders"),
        where("creatorId", "==", creatorId)
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      const completedOrders = ordersSnapshot.docs.filter(
        (doc) => doc.data().status === "completed"
      ).length;

      const completionRate =
        ordersSnapshot.size > 0
          ? (completedOrders / ordersSnapshot.size) * 100
          : 100;

      // Calculate repeat customers
      const customerIds = new Set();
      const repeatCustomerIds = new Set();

      ordersSnapshot.docs.forEach((doc) => {
        const customerId = doc.data().customerId;
        if (customerIds.has(customerId)) {
          repeatCustomerIds.add(customerId);
        } else {
          customerIds.add(customerId);
        }
      });

      return {
        totalProjects: projectsSnapshot.size,
        totalSales,
        totalEarnings,
        averageRating: totalReviews > 0 ? totalRating / totalReviews : 0,
        totalReviews,
        responseTime: "Usually responds within 2 hours", // This could be calculated from message response times
        completionRate,
        repeatCustomers: repeatCustomerIds.size,
      };
    } catch (error) {
      console.error("Error getting creator stats:", error);
      return {
        totalProjects: 0,
        totalSales: 0,
        totalEarnings: 0,
        averageRating: 0,
        totalReviews: 0,
        responseTime: "Unknown",
        completionRate: 0,
        repeatCustomers: 0,
      };
    }
  }

  // Update user online status
  async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      await updateDoc(doc(db, "users", userId), {
        isOnline,
        lastActive: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating online status:", error);
    }
  }

  // Add work experience
  async addWorkExperience(
    userId: string,
    experience: Omit<WorkExperience, "id">
  ): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const workExperience = userData.workExperience || [];

        const newExperience: WorkExperience = {
          ...experience,
          id: Date.now().toString(), // Simple ID generation
        };

        await updateDoc(doc(db, "users", userId), {
          workExperience: [...workExperience, newExperience],
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error adding work experience:", error);
      throw error;
    }
  }

  // Update work experience
  async updateWorkExperience(
    userId: string,
    experienceId: string,
    updates: Partial<WorkExperience>
  ): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const workExperience = userData.workExperience || [];

        const updatedExperience = workExperience.map((exp: WorkExperience) =>
          exp.id === experienceId ? { ...exp, ...updates } : exp
        );

        await updateDoc(doc(db, "users", userId), {
          workExperience: updatedExperience,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error updating work experience:", error);
      throw error;
    }
  }

  // Delete work experience
  async deleteWorkExperience(
    userId: string,
    experienceId: string
  ): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const workExperience = userData.workExperience || [];

        const filteredExperience = workExperience.filter(
          (exp: WorkExperience) => exp.id !== experienceId
        );

        await updateDoc(doc(db, "users", userId), {
          workExperience: filteredExperience,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error deleting work experience:", error);
      throw error;
    }
  }

  // Similar methods for education
  async addEducation(
    userId: string,
    education: Omit<Education, "id">
  ): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const educationList = userData.education || [];

        const newEducation: Education = {
          ...education,
          id: Date.now().toString(),
        };

        await updateDoc(doc(db, "users", userId), {
          education: [...educationList, newEducation],
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error adding education:", error);
      throw error;
    }
  }

  // Get user's projects
  async getUserProjects(
    userId: string,
    limitCount: number = 20
  ): Promise<any[]> {
    try {
      const q = query(
        collection(db, "projects"),
        where("creatorId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {
      console.error("Error getting user projects:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
