/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

export class MinimalLikesService {
  async toggleLike(projectId: string, userId: string) {
    try {
      const likeRef = doc(db, "projects", projectId, "likes", userId);
      const likeDoc = await getDoc(likeRef);

      if (likeDoc.exists()) {
        // Unlike
        await deleteDoc(likeRef);
        await this.updateLikesCount(projectId, -1);
        return { liked: false };
      } else {
        // Like
        await setDoc(likeRef, {
          userId,
          projectId,
          createdAt: new Date(),
        });
        await this.updateLikesCount(projectId, 1);
        return { liked: true };
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  }

  async getProjectLikesCount(projectId: string): Promise<number> {
    try {
      const likesRef = collection(db, "projects", projectId, "likes");
      const snapshot = await getDocs(likesRef);
      return snapshot.size;
    } catch (error) {
      console.error("Error getting likes count:", error);
      return 0;
    }
  }

  async hasUserLiked(projectId: string, userId: string): Promise<boolean> {
    try {
      const likeRef = doc(db, "projects", projectId, "likes", userId);
      const likeDoc = await getDoc(likeRef);
      return likeDoc.exists();
    } catch (error) {
      console.error("Error checking user like:", error);
      return false;
    }
  }

  private async updateLikesCount(projectId: string, delta: number) {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      totalLikes: increment(delta),
    });
  }
}

export const minimalLikesService = new MinimalLikesService();
