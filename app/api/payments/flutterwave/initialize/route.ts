import { NextRequest, NextResponse } from "next/server";

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!FLUTTERWAVE_SECRET_KEY) {
      return NextResponse.json(
        { status: "error", message: "Flutterwave secret key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount, currency, email, tx_ref, redirect_url, meta } = body;

    // Validate required fields
    if (!amount || !currency || !email || !tx_ref) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize payment with Flutterwave
    const flutterwaveResponse = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency,
        redirect_url,
        customer: {
          email,
        },
        customizations: {
          title: "Project02 - Academic Project Purchase",
          description: "Payment for academic project",
          logo: "https://project02.com/logo.png",
        },
        meta,
      }),
    });

    const flutterwaveData = await flutterwaveResponse.json();

    if (flutterwaveData.status === "success") {
      return NextResponse.json({
        status: "success",
        message: "Payment initialized successfully",
        data: {
          link: flutterwaveData.data.link,
          tx_ref: flutterwaveData.data.tx_ref,
        },
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: flutterwaveData.message || "Failed to initialize payment",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Flutterwave initialization error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
