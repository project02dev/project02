/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  writeBatch,
} from "firebase/firestore";
import {
  Order,
  PaymentMethod,
  Purchase,
  CreatorEarnings,
} from "@/types/database";
import { currencyService } from "./currencyService";
import { notificationService } from "./notificationService";
import { storageService } from "../storage";

export class PaymentService {
  // Initialize payment with multiple providers
  async initializePayment(
    projectId: string,
    buyerId: string,
    buyerEmail: string,
    amount: number,
    currency: string = "USD",
    paymentMethod: "paystack" | "stripe" | "paypal" | "flutterwave" = "paystack"
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Get project details
      const projectDoc = await getDoc(doc(db, "projects", projectId));
      if (!projectDoc.exists()) {
        return { success: false, error: "Project not found" };
      }

      const project = projectDoc.data();

      // Create order record
      const orderData: Partial<Order> = {
        projectId,
        projectTitle: project.title,
        projectThumbnail: project.thumbnailUrl,
        buyerId,
        buyerEmail,
        creatorId: project.creatorId,
        creatorName: project.creatorName,
        amount,
        currency,
        paymentMethod,
        status: "pending",
        downloadCount: 0,
        maxDownloads: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);
      const orderId = orderRef.id;

      // Initialize payment based on provider
      let paymentData;
      switch (paymentMethod) {
        case "paystack":
          paymentData = await this.initializePaystack(
            orderId,
            buyerEmail,
            amount,
            currency
          );
          break;
        case "stripe":
          paymentData = await this.initializeStripe(
            orderId,
            buyerEmail,
            amount,
            currency
          );
          break;
        case "paypal":
          paymentData = await this.initializePaypal(orderId, amount, currency);
          break;
        case "flutterwave":
          paymentData = await this.initializeFlutterwave(
            orderId,
            buyerEmail,
            amount,
            currency
          );
          break;
        default:
          return { success: false, error: "Unsupported payment method" };
      }

      if (paymentData.success) {
        // Update order with payment reference
        await updateDoc(orderRef, {
          paymentReference: paymentData.reference,
          updatedAt: serverTimestamp(),
        });

        return {
          success: true,
          data: {
            orderId,
            paymentUrl: paymentData.paymentUrl,
            reference: paymentData.reference,
          },
        };
      }

      return { success: false, error: paymentData.error };
    } catch (error) {
      console.error("Error initializing payment:", error);
      return { success: false, error: "Failed to initialize payment" };
    }
  }

  // Paystack integration
  private async initializePaystack(
    orderId: string,
    email: string,
    amount: number,
    currency: string
  ) {
    try {
      // Get the base URL for callback
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      // Convert USD to NGN using real exchange rates
      let paystackAmount = amount;
      let paystackCurrency = currency;
      let exchangeRate = 1;

      if (currency === "USD") {
        const conversion = await currencyService.convertUSDToNGN(amount);
        paystackAmount = conversion.ngnAmount;
        paystackCurrency = "NGN";
        exchangeRate = conversion.exchangeRate;

        console.log(
          `Converting ${amount} USD to ${paystackAmount} NGN at rate ${exchangeRate}`
        );
      }

      const response = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount: paystackAmount * 100, // Paystack expects amount in kobo
          currency: paystackCurrency,
          reference: `order_${orderId}_${Date.now()}`,
          callback_url: `${baseUrl}/payment/callback`,
          metadata: {
            orderId,
            originalAmount: amount,
            originalCurrency: currency,
            exchangeRate: exchangeRate,
            convertedAmount: paystackAmount,
          },
        }),
      });

      const data = await response.json();

      if (data.status) {
        return {
          success: true,
          reference: data.data.reference,
          paymentUrl: data.data.authorization_url,
        };
      }

      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: "Paystack initialization failed" };
    }
  }

  // Stripe integration
  private async initializeStripe(
    orderId: string,
    email: string,
    amount: number,
    currency: string
  ) {
    try {
      const response = await fetch("/api/payments/stripe/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100, // Stripe expects amount in cents
          currency: currency.toLowerCase(),
          orderId,
          customerEmail: email,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          reference: data.sessionId,
          paymentUrl: data.url,
        };
      }

      return { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: "Stripe initialization failed" };
    }
  }

  // PayPal integration
  private async initializePaypal(
    orderId: string,
    amount: number,
    currency: string
  ) {
    try {
      const response = await fetch("/api/payments/paypal/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          orderId,
          returnUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          reference: data.orderId,
          paymentUrl: data.approvalUrl,
        };
      }

      return { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: "PayPal initialization failed" };
    }
  }

  // Flutterwave integration
  private async initializeFlutterwave(
    orderId: string,
    email: string,
    amount: number,
    currency: string
  ) {
    try {
      const response = await fetch("/api/payments/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          email,
          tx_ref: `order_${orderId}_${Date.now()}`,
          redirect_url: `${window.location.origin}/payment/callback`,
          meta: { orderId },
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        return {
          success: true,
          reference: data.data.tx_ref,
          paymentUrl: data.data.link,
        };
      }

      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: "Flutterwave initialization failed" };
    }
  }

  // Verify payment and complete order
  async verifyPayment(
    orderId: string,
    reference: string,
    paymentMethod: string
  ): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const orderDoc = await getDoc(doc(db, "orders", orderId));
      if (!orderDoc.exists()) {
        return { success: false, error: "Order not found" };
      }

      const order = { id: orderId, ...orderDoc.data() } as Order;

      // Verify payment with provider
      let verificationResult;
      switch (paymentMethod) {
        case "paystack":
          verificationResult = await this.verifyPaystack(reference);
          break;
        case "stripe":
          verificationResult = await this.verifyStripe(reference);
          break;
        case "paypal":
          verificationResult = await this.verifyPaypal(reference);
          break;
        case "flutterwave":
          verificationResult = await this.verifyFlutterwave(reference);
          break;
        default:
          return { success: false, error: "Unsupported payment method" };
      }

      if (verificationResult.success) {
        // Ensure order has the correct ID
        const orderWithId = { ...order, id: orderId };
        await this.completeOrder(orderId, verificationResult.data);
        return { success: true, order: orderWithId };
      }

      return { success: false, error: verificationResult.error };
    } catch (error) {
      console.error("Error verifying payment:", error);
      return { success: false, error: "Payment verification failed" };
    }
  }

  // Complete order after successful payment
  private async completeOrder(orderId: string, paymentData: any) {
    const batch = writeBatch(db);

    try {
      // Get the order data first
      const orderDoc = await getDoc(doc(db, "orders", orderId));
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const orderData = { id: orderId, ...orderDoc.data() } as Order;

      // Update order status
      const orderRef = doc(db, "orders", orderId);
      batch.update(orderRef, {
        status: "completed",
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        paymentReference: paymentData.reference,
        metadata: {
          paymentGatewayResponse: paymentData,
          exchangeRate: paymentData.metadata?.exchangeRate,
          originalAmount: paymentData.metadata?.originalAmount,
          originalCurrency: paymentData.metadata?.originalCurrency,
        },
      });

      // Generate download URL for the project files
      const downloadUrl = await this.generateDownloadUrl(orderData.projectId);

      // Create purchase record
      const purchaseData: Partial<Purchase> = {
        orderId,
        projectId: orderData.projectId,
        buyerId: orderData.buyerId,
        createdAt: new Date(),
        accessGranted: true,
        downloadCount: 0,
        amount: orderData.amount,
        currency: orderData.currency,
        projectTitle: orderData.projectTitle,
        downloadUrl: downloadUrl,
      };

      const purchaseRef = doc(collection(db, "purchases"));
      batch.set(purchaseRef, purchaseData);

      // Update project stats
      const projectRef = doc(db, "projects", orderData.projectId);
      batch.update(projectRef, {
        totalPurchases: increment(1),
        totalRevenue: increment(orderData.amount),
        updatedAt: serverTimestamp(),
      });

      // Create creator earnings record
      const platformFee = orderData.amount * 0.15; // 15% platform fee
      const paymentFee = orderData.amount * 0.029; // ~3% payment gateway fee
      const netAmount = orderData.amount - platformFee - paymentFee;

      const earningsData: Partial<CreatorEarnings> = {
        creatorId: orderData.creatorId,
        orderId,
        projectId: orderData.projectId,
        grossAmount: orderData.amount,
        platformFee,
        paymentFee,
        netAmount,
        currency: orderData.currency,
        status: "available",
        createdAt: new Date(),
        paymentReference: paymentData.reference,
      };

      const earningsRef = doc(collection(db, "earnings"));
      batch.set(earningsRef, earningsData);

      await batch.commit();

      // Send notifications
      await this.sendPurchaseNotifications(orderData, netAmount);
    } catch (error) {
      console.error("Error completing order:", error);
      throw error;
    }
  }

  // Generate download URL for purchased project
  private async generateDownloadUrl(
    projectId: string
  ): Promise<string | undefined> {
    try {
      // Get project files from storage
      const projectFilesPath = `projects/${projectId}/files/`;

      // For now, we'll create a secure download endpoint
      // This should be replaced with actual file discovery from storage
      return `/api/download/${projectId}`;
    } catch (error) {
      console.error("Error generating download URL:", error);
      return undefined;
    }
  }

  // Send notifications for purchase
  private async sendPurchaseNotifications(orderData: Order, netAmount: number) {
    try {
      console.log("Sending notifications for order:", orderData);

      // Validate required fields
      if (!orderData.id || !orderData.buyerId || !orderData.creatorId) {
        console.error("Missing required order data for notifications:", {
          orderId: orderData.id,
          buyerId: orderData.buyerId,
          creatorId: orderData.creatorId,
        });
        return;
      }

      await notificationService.createPaymentNotifications({
        orderId: orderData.id,
        projectId: orderData.projectId,
        projectTitle: orderData.projectTitle,
        buyerId: orderData.buyerId,
        buyerName: orderData.buyerName || "Unknown Buyer",
        creatorId: orderData.creatorId,
        creatorName: orderData.creatorName || "Unknown Creator",
        amount: orderData.amount,
        currency: orderData.currency,
        netAmount: netAmount,
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  }

  // Get user's purchases
  async getUserPurchases(userId: string): Promise<Purchase[]> {
    try {
      const q = query(
        collection(db, "purchases"),
        where("buyerId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastDownloadAt: doc.data().lastDownloadAt?.toDate(),
      })) as Purchase[];
    } catch (error) {
      console.error("Error getting user purchases:", error);
      return [];
    }
  }

  // Get creator's sales
  async getCreatorSales(creatorId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, "orders"),
        where("creatorId", "==", creatorId),
        where("status", "==", "completed"),
        orderBy("completedAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error("Error getting creator sales:", error);
      return [];
    }
  }

  // Verify payment methods
  private async verifyPaystack(reference: string) {
    try {
      console.log("Verifying with Paystack API:", reference);

      const response = await fetch(
        `/api/payments/paystack/verify?reference=${reference}`
      );
      const data = await response.json();

      console.log("Paystack API response:", data);

      if (data.status) {
        return {
          success: true,
          data: {
            amount: data.data.amount,
            currency: data.data.currency,
            reference: data.data.reference,
            status: data.data.status,
            metadata: data.data.metadata,
          },
        };
      }

      return { success: false, error: data.message };
    } catch (error) {
      console.error("Paystack verification error:", error);
      return { success: false, error: "Verification failed" };
    }
  }

  private async verifyStripe(sessionId: string) {
    try {
      const response = await fetch(`/api/payments/stripe/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      }

      return { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: "Verification failed" };
    }
  }

  private async verifyPaypal(orderId: string) {
    try {
      const response = await fetch(`/api/payments/paypal/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      }

      return { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: "Verification failed" };
    }
  }

  private async verifyFlutterwave(reference: string) {
    try {
      const response = await fetch(
        `/api/payments/flutterwave/verify?reference=${reference}`
      );
      const data = await response.json();

      if (data.status === "success") {
        return { success: true, data: data.data };
      }

      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: "Verification failed" };
    }
  }
}

export const paymentService = new PaymentService();
