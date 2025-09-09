/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import {
  Order,
  Purchase,
  Project,
  DashboardStats,
  CreatorEarnings,
} from "@/types/database";

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

export class DashboardService {
  // Get student dashboard data
  async getStudentDashboard(userId: string): Promise<{
    stats: {
      totalPurchases: number;
      totalSpent: number;
      recentPurchases: number;
      favoriteProjects: number;
    };
    recentPurchases: Purchase[];
    recentProjects: Project[];
    recommendations: Project[];
  }> {
    try {
      // Get user's purchases
      const purchasesQuery = query(
        collection(db, "purchases"),
        where("buyerId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const purchasesSnapshot = await getDocs(purchasesQuery);
      const purchases = purchasesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastDownloadAt: doc.data().lastDownloadAt?.toDate(),
      })) as Purchase[];

      // Get orders for spending calculation
      const ordersQuery = query(
        collection(db, "orders"),
        where("buyerId", "==", userId),
        where("status", "==", "completed")
      );

      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertToDate(data.createdAt) || new Date(),
          completedAt: convertToDate(data.completedAt),
        } as Order;
      });

      // Calculate stats
      const totalPurchases = purchases.length;
      const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);

      // Recent purchases (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentPurchases = purchases.filter(
        (p) => p.createdAt >= thirtyDaysAgo
      ).length;

      // Get liked projects count
      const likesQuery = query(
        collection(db, "likes"),
        where("userId", "==", userId)
      );
      const likesSnapshot = await getDocs(likesQuery);
      const favoriteProjects = likesSnapshot.size;

      // Get recent purchased projects details
      const recentPurchaseProjects = await this.getProjectsByIds(
        purchases.slice(0, 5).map((p) => p.projectId)
      );

      // Get recommended projects (popular projects not purchased)
      const purchasedProjectIds = purchases.map((p) => p.projectId);
      const recommendations = await this.getRecommendedProjects(
        userId,
        purchasedProjectIds
      );

      return {
        stats: {
          totalPurchases,
          totalSpent,
          recentPurchases,
          favoriteProjects,
        },
        recentPurchases: purchases.slice(0, 5),
        recentProjects: recentPurchaseProjects,
        recommendations,
      };
    } catch (error) {
      console.error("Error getting student dashboard:", error);
      return {
        stats: {
          totalPurchases: 0,
          totalSpent: 0,
          recentPurchases: 0,
          favoriteProjects: 0,
        },
        recentPurchases: [],
        recentProjects: [],
        recommendations: [],
      };
    }
  }

  // Get creator dashboard data
  async getCreatorDashboard(userId: string): Promise<{
    stats: {
      totalProjects: number;
      totalSales: number;
      totalEarnings: number;
      totalLikes: number;
      averageRating: number;
      recentSales: number;
    };
    recentSales: Order[];
    topProjects: Project[];
    monthlyEarnings: { month: string; earnings: number }[];
    recentEarnings: CreatorEarnings[];
  }> {
    try {
      // Get creator's projects
      const projectsQuery = query(
        collection(db, "projects"),
        where("creatorId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const projectsSnapshot = await getDocs(projectsQuery);
      const projects = projectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        publishedAt: doc.data().publishedAt?.toDate(),
      })) as Project[];

      // Get creator's sales
      const salesQuery = query(
        collection(db, "orders"),
        where("creatorId", "==", userId),
        where("status", "==", "completed"),
        orderBy("completedAt", "desc")
      );

      const salesSnapshot = await getDocs(salesQuery);
      const sales = salesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Order[];

      // Get creator's earnings
      const earningsQuery = query(
        collection(db, "earnings"),
        where("creatorId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      const earningsSnapshot = await getDocs(earningsQuery);
      const earnings = earningsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        paidAt: doc.data().paidAt?.toDate(),
      })) as CreatorEarnings[];

      // Calculate stats
      const totalProjects = projects.length;
      const totalSales = sales.length;
      const totalEarnings = earnings.reduce(
        (sum, earning) => sum + earning.netAmount,
        0
      );
      const totalLikes = projects.reduce(
        (sum, project) => sum + (project.totalLikes || 0),
        0
      );
      const totalReviews = projects.reduce(
        (sum, project) => sum + (project.totalReviews || 0),
        0
      );
      const totalRating = projects.reduce(
        (sum, project) =>
          sum + (project.averageRating || 0) * (project.totalReviews || 0),
        0
      );
      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      // Recent sales (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentSales = sales.filter(
        (s) => s.completedAt && s.completedAt >= thirtyDaysAgo
      ).length;

      // Calculate monthly earnings for the last 6 months
      const monthlyEarnings = this.calculateMonthlyEarnings(earnings);

      // Get top performing projects
      const topProjects = projects
        .sort((a, b) => (b.totalPurchases || 0) - (a.totalPurchases || 0))
        .slice(0, 5);

      return {
        stats: {
          totalProjects,
          totalSales,
          totalEarnings,
          totalLikes,
          averageRating,
          recentSales,
        },
        recentSales: sales.slice(0, 10),
        topProjects,
        monthlyEarnings,
        recentEarnings: earnings,
      };
    } catch (error) {
      console.error("Error getting creator dashboard:", error);
      return {
        stats: {
          totalProjects: 0,
          totalSales: 0,
          totalEarnings: 0,
          totalLikes: 0,
          averageRating: 0,
          recentSales: 0,
        },
        recentSales: [],
        topProjects: [],
        monthlyEarnings: [],
        recentEarnings: [],
      };
    }
  }

  // Get projects by IDs
  private async getProjectsByIds(projectIds: string[]): Promise<Project[]> {
    if (projectIds.length === 0) return [];

    try {
      const projects: Project[] = [];

      // Firestore 'in' query limit is 10, so we need to batch
      for (let i = 0; i < projectIds.length; i += 10) {
        const batch = projectIds.slice(i, i + 10);
        const batchQuery = query(
          collection(db, "projects"),
          where(
            "__name__",
            "in",
            batch.map((id) => doc(db, "projects", id))
          )
        );

        const snapshot = await getDocs(batchQuery);
        const batchProjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          publishedAt: doc.data().publishedAt?.toDate(),
        })) as Project[];

        projects.push(...batchProjects);
      }

      return projects;
    } catch (error) {
      console.error("Error getting projects by IDs:", error);
      return [];
    }
  }

  // Get recommended projects
  private async getRecommendedProjects(
    userId: string,
    excludeProjectIds: string[]
  ): Promise<Project[]> {
    try {
      // Get popular projects that user hasn't purchased
      const projectsQuery = query(
        collection(db, "projects"),
        where("status", "==", "published"),
        orderBy("totalPurchases", "desc"),
        limit(20)
      );

      const snapshot = await getDocs(projectsQuery);
      const projects = (
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          publishedAt: doc.data().publishedAt?.toDate(),
        })) as Project[]
      )
        .filter((project) => !excludeProjectIds.includes(project.id))
        .slice(0, 6);

      return projects;
    } catch (error) {
      console.error("Error getting recommended projects:", error);
      return [];
    }
  }

  // Calculate monthly earnings
  private calculateMonthlyEarnings(
    earnings: CreatorEarnings[]
  ): { month: string; earnings: number }[] {
    const monthlyData: { [key: string]: number } = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      monthlyData[monthKey] = 0;
    }

    // Aggregate earnings by month
    earnings.forEach((earning) => {
      const monthKey = earning.createdAt.toISOString().slice(0, 7);
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += earning.netAmount;
      }
    });

    // Convert to array format
    return Object.entries(monthlyData).map(([month, earnings]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      earnings,
    }));
  }

  // Get user's purchase history with project details
  async getUserPurchaseHistory(
    userId: string,
    limitCount: number = 20,
    lastDoc?: any
  ): Promise<{
    purchases: (Purchase & { project?: Project })[];
    hasMore: boolean;
    lastDoc?: any;
  }> {
    try {
      let purchasesQuery = query(
        collection(db, "purchases"),
        where("buyerId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      if (lastDoc) {
        purchasesQuery = query(
          collection(db, "purchases"),
          where("buyerId", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(limitCount)
        );
      }

      const snapshot = await getDocs(purchasesQuery);
      const purchases = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastDownloadAt: doc.data().lastDownloadAt?.toDate(),
      })) as Purchase[];

      // Get project details for each purchase
      const projectIds = purchases.map((p) => p.projectId);
      const projects = await this.getProjectsByIds(projectIds);

      // Combine purchase and project data
      const purchasesWithProjects = purchases.map((purchase) => ({
        ...purchase,
        project: projects.find((p) => p.id === purchase.projectId),
      }));

      return {
        purchases: purchasesWithProjects,
        hasMore: snapshot.docs.length === limitCount,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
      };
    } catch (error) {
      console.error("Error getting purchase history:", error);
      return { purchases: [], hasMore: false };
    }
  }

  // Get creator's sales history with project details
  async getCreatorSalesHistory(
    creatorId: string,
    limitCount: number = 20,
    lastDoc?: any
  ): Promise<{
    sales: (Order & { project?: Project })[];
    hasMore: boolean;
    lastDoc?: any;
  }> {
    try {
      let salesQuery = query(
        collection(db, "orders"),
        where("creatorId", "==", creatorId),
        where("status", "==", "completed"),
        orderBy("completedAt", "desc"),
        limit(limitCount)
      );

      if (lastDoc) {
        salesQuery = query(
          collection(db, "orders"),
          where("creatorId", "==", creatorId),
          where("status", "==", "completed"),
          orderBy("completedAt", "desc"),
          startAfter(lastDoc),
          limit(limitCount)
        );
      }

      const snapshot = await getDocs(salesQuery);
      const sales = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Order[];

      // Get project details for each sale
      const projectIds = [...new Set(sales.map((s) => s.projectId))];
      const projects = await this.getProjectsByIds(projectIds);

      // Combine sale and project data
      const salesWithProjects = sales.map((sale) => ({
        ...sale,
        project: projects.find((p) => p.id === sale.projectId),
      }));

      return {
        sales: salesWithProjects,
        hasMore: snapshot.docs.length === limitCount,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
      };
    } catch (error) {
      console.error("Error getting sales history:", error);
      return { sales: [], hasMore: false };
    }
  }
}

export const dashboardService = new DashboardService();
