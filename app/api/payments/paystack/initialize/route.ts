import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { status: false, message: "Paystack secret key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, amount, currency, reference, callback_url, metadata } = body;

    // Validate required fields
    if (!email || !amount || !reference) {
      return NextResponse.json(
        { status: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize payment with Paystack
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount, // Amount in kobo (already converted in frontend)
        currency: currency || "NGN",
        reference,
        callback_url,
        metadata,
        channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
      }),
    });

    const paystackData = await paystackResponse.json();

    if (paystackData.status) {
      return NextResponse.json({
        status: true,
        message: "Payment initialized successfully",
        data: {
          authorization_url: paystackData.data.authorization_url,
          access_code: paystackData.data.access_code,
          reference: paystackData.data.reference,
        },
      });
    } else {
      return NextResponse.json(
        {
          status: false,
          message: paystackData.message || "Failed to initialize payment",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Paystack initialization error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
