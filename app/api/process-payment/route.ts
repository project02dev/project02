import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase/config";
import {
  doc,
  setDoc,
  updateDoc,
  increment,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, projectId, userId } = await request.json();

    // Validate required fields
    if (!paymentIntentId || !projectId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Get project details
    const projectDoc = await getDoc(doc(db, "projects", projectId));
    if (!projectDoc.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectDoc.data();
    const amount = paymentIntent.amount / 100; // Convert from cents

    // Create order record
    const orderData = {
      id: paymentIntentId,
      userId,
      projectId,
      creatorId: projectData.creatorId,
      amount,
      currency: paymentIntent.currency,
      status: "completed",
      paymentIntentId,
      projectTitle: projectData.title,
      projectPrice: projectData.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order to Firestore
    await setDoc(doc(db, "orders", paymentIntentId), orderData);

    // Update project sales count
    await updateDoc(doc(db, "projects", projectId), {
      totalSales: increment(1),
      updatedAt: new Date().toISOString(),
    });

    // Update user's purchased projects
    const userPurchasesRef = collection(db, "users", userId, "purchases");
    await addDoc(userPurchasesRef, {
      projectId,
      orderId: paymentIntentId,
      purchasedAt: new Date().toISOString(),
      amount,
      projectTitle: projectData.title,
    });

    // Calculate creator earnings (85% after 15% platform fee)
    const creatorEarnings = amount * 0.85;

    // Update creator earnings
    const creatorRef = doc(db, "users", projectData.creatorId);
    const creatorDoc = await getDoc(creatorRef);

    if (creatorDoc.exists()) {
      await updateDoc(creatorRef, {
        totalEarnings: increment(creatorEarnings),
        totalSales: increment(1),
        updatedAt: new Date().toISOString(),
      });
    }

    // Create earnings record for creator
    const earningsRef = collection(
      db,
      "users",
      projectData.creatorId,
      "earnings"
    );
    await addDoc(earningsRef, {
      orderId: paymentIntentId,
      projectId,
      amount: creatorEarnings,
      platformFee: amount * 0.15,
      grossAmount: amount,
      createdAt: new Date().toISOString(),
      status: "pending", // Will be paid out weekly
    });

    return NextResponse.json({
      success: true,
      orderId: paymentIntentId,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
