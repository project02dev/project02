import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  writeBatch,
  onSnapshot,
} from "firebase/firestore";
import { ProjectLike } from "@/types/database";

export class LikesService {
  // Toggle like for a project
  async toggleLike(
    projectId: string,
    userId: string
  ): Promise<{
    success: boolean;
    isLiked: boolean;
    totalLikes: number;
    error?: string;
  }> {
    try {
      // Check if user already liked this project
      const existingLike = await this.getUserLike(projectId, userId);

      if (existingLike) {
        // Unlike the project
        await this.unlikeProject(projectId, userId, existingLike.id);
        const totalLikes = await this.getProjectLikesCount(projectId);
        return { success: true, isLiked: false, totalLikes };
      } else {
        // Like the project
        await this.likeProject(projectId, userId);
        const totalLikes = await this.getProjectLikesCount(projectId);
        return { success: true, isLiked: true, totalLikes };
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      return {
        success: false,
        isLiked: false,
        totalLikes: 0,
        error: "Failed to toggle like",
      };
    }
  }

  // Like a project
  private async likeProject(projectId: string, userId: string) {
    const batch = writeBatch(db);

    try {
      // Add like record
      const likeData: Partial<ProjectLike> = {
        projectId,
        userId,
        createdAt: new Date(),
      };

      const likeRef = doc(db, "projects", projectId, "likes", userId);
      batch.set(likeRef, likeData);

      // Update project likes count
      const projectRef = doc(db, "projects", projectId);
      batch.update(projectRef, {
        totalLikes: increment(1),
        updatedAt: serverTimestamp(),
      });

      // Update project stats
      const statsRef = doc(db, "projectStats", projectId);
      batch.set(
        statsRef,
        {
          projectId,
          totalLikes: increment(1),
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );

      await batch.commit();

      // Send notification to project creator
      await this.sendLikeNotification(projectId, userId);
    } catch (error) {
      console.error("Error liking project:", error);
      throw error;
    }
  }

  // Unlike a project
  private async unlikeProject(
    projectId: string,
    userId: string,
    likeId: string
  ) {
    const batch = writeBatch(db);

    try {
      // Remove like record
      const likeRef = doc(db, "projects", projectId, "likes", userId);
      batch.delete(likeRef);

      // Update project likes count
      const projectRef = doc(db, "projects", projectId);
      batch.update(projectRef, {
        totalLikes: increment(-1),
        updatedAt: serverTimestamp(),
      });

      // Update project stats
      const statsRef = doc(db, "projectStats", projectId);
      batch.update(statsRef, {
        totalLikes: increment(-1),
        lastUpdated: serverTimestamp(),
      });

      await batch.commit();
    } catch (error) {
      console.error("Error unliking project:", error);
      throw error;
    }
  }

  // Check if user liked a project
  async getUserLike(
    projectId: string,
    userId: string
  ): Promise<ProjectLike | null> {
    try {
      const q = query(
        collection(db, "projects", projectId, "likes"),
        where("userId", "==", userId),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as ProjectLike;
    } catch (error) {
      console.error("Error getting user like:", error);
      return null;
    }
  }

  // Check if user liked a project (boolean)
  async hasUserLiked(projectId: string, userId: string): Promise<boolean> {
    const like = await this.getUserLike(projectId, userId);
    return like !== null;
  }

  // Get project likes count
  async getProjectLikesCount(projectId: string): Promise<number> {
    try {
      const q = query(collection(db, "projects", projectId, "likes"));

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error("Error getting project likes count:", error);
      return 0;
    }
  }

  // Get users who liked a project
  async getProjectLikes(
    projectId: string,
    limitCount: number = 50
  ): Promise<ProjectLike[]> {
    try {
      const q = query(
        collection(db, "likes"),
        where("projectId", "==", projectId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as ProjectLike[];
    } catch (error) {
      console.error("Error getting project likes:", error);
      return [];
    }
  }

  // Get projects liked by a user
  async getUserLikedProjects(
    userId: string,
    limitCount: number = 50
  ): Promise<ProjectLike[]> {
    try {
      const q = query(
        collection(db, "likes"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as ProjectLike[];
    } catch (error) {
      console.error("Error getting user liked projects:", error);
      return [];
    }
  }

  // Get trending projects based on recent likes
  async getTrendingProjects(
    days: number = 7,
    limitCount: number = 10
  ): Promise<{ projectId: string; likesCount: number }[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const q = query(
        collection(db, "likes"),
        where("createdAt", ">=", cutoffDate),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      // Count likes per project
      const projectLikes: { [projectId: string]: number } = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const projectId = data.projectId;
        projectLikes[projectId] = (projectLikes[projectId] || 0) + 1;
      });

      // Sort by likes count and return top projects
      return Object.entries(projectLikes)
        .map(([projectId, likesCount]) => ({ projectId, likesCount }))
        .sort((a, b) => b.likesCount - a.likesCount)
        .slice(0, limitCount);
    } catch (error) {
      console.error("Error getting trending projects:", error);
      return [];
    }
  }

  // Listen to project likes in real-time
  subscribeToProjectLikes(
    projectId: string,
    callback: (likes: ProjectLike[]) => void
  ) {
    const q = query(
      collection(db, "likes"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const likes: ProjectLike[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as ProjectLike[];

      callback(likes);
    });
  }

  // Send notification when someone likes a project
  private async sendLikeNotification(projectId: string, likerId: string) {
    try {
      // Get project details
      const projectDoc = await getDoc(doc(db, "projects", projectId));
      if (!projectDoc.exists()) return;

      const project = projectDoc.data();

      // Don't notify if creator liked their own project
      if (project.creatorId === likerId) return;

      // Get liker details
      const likerDoc = await getDoc(doc(db, "users", likerId));
      if (!likerDoc.exists()) return;

      const liker = likerDoc.data();

      // Create notification
      await addDoc(collection(db, "notifications"), {
        userId: project.creatorId,
        type: "like",
        title: "Someone liked your project!",
        message: `${liker.fullName || "Someone"} liked your project "${
          project.title
        }".`,
        data: {
          projectId,
          likerId,
          likerName: liker.fullName,
          likerAvatar: liker.avatar,
        },
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending like notification:", error);
    }
  }

  // Get like statistics for a user's projects
  async getCreatorLikeStats(creatorId: string): Promise<{
    totalLikes: number;
    recentLikes: number;
    topLikedProject?: { projectId: string; title: string; likes: number };
  }> {
    try {
      // Get all projects by creator
      const projectsQuery = query(
        collection(db, "projects"),
        where("creatorId", "==", creatorId)
      );

      const projectsSnapshot = await getDocs(projectsQuery);
      const projectIds = projectsSnapshot.docs.map((doc) => doc.id);

      if (projectIds.length === 0) {
        return { totalLikes: 0, recentLikes: 0 };
      }

      // Get all likes for creator's projects
      const likesQuery = query(
        collection(db, "likes"),
        where("projectId", "in", projectIds.slice(0, 10)) // Firestore limit
      );

      const likesSnapshot = await getDocs(likesQuery);

      // Calculate stats
      const totalLikes = likesSnapshot.size;

      // Recent likes (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const recentLikes = likesSnapshot.docs.filter((doc) => {
        const likeDate = doc.data().createdAt?.toDate() || new Date(0);
        return likeDate >= weekAgo;
      }).length;

      // Find top liked project
      const projectLikeCounts: { [projectId: string]: number } = {};
      likesSnapshot.docs.forEach((doc) => {
        const projectId = doc.data().projectId;
        projectLikeCounts[projectId] = (projectLikeCounts[projectId] || 0) + 1;
      });

      let topLikedProject;
      if (Object.keys(projectLikeCounts).length > 0) {
        const topProjectId = Object.entries(projectLikeCounts).sort(
          ([, a], [, b]) => b - a
        )[0][0];

        const topProject = projectsSnapshot.docs.find(
          (doc) => doc.id === topProjectId
        );
        if (topProject) {
          topLikedProject = {
            projectId: topProjectId,
            title: topProject.data().title,
            likes: projectLikeCounts[topProjectId],
          };
        }
      }

      return {
        totalLikes,
        recentLikes,
        topLikedProject,
      };
    } catch (error) {
      console.error("Error getting creator like stats:", error);
      return { totalLikes: 0, recentLikes: 0 };
    }
  }
}

export const likesService = new LikesService();
