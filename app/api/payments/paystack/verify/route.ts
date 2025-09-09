import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { status: false, message: "Paystack secret key not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { status: false, message: "Payment reference is required" },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!paystackResponse.ok) {
      const errorText = await paystackResponse.text();
      console.error("Paystack API error:", errorText);
      return NextResponse.json(
        { status: false, message: "Failed to verify payment with Paystack" },
        { status: paystackResponse.status }
      );
    }

    const paystackData = await paystackResponse.json();

    if (paystackData.status && paystackData.data.status === "success") {
      return NextResponse.json({
        status: true,
        message: "Payment verified successfully",
        data: {
          reference: paystackData.data.reference,
          amount: paystackData.data.amount / 100, // Convert from kobo to naira
          currency: paystackData.data.currency,
          status: paystackData.data.status,
          paid_at: paystackData.data.paid_at,
          customer: paystackData.data.customer,
          metadata: paystackData.data.metadata,
          gateway_response: paystackData.data.gateway_response,
        },
      });
    } else {
      return NextResponse.json(
        {
          status: false,
          message: paystackData.message || "Payment verification failed",
          data: paystackData.data,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Paystack verification error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { status: false, message: "Payment reference is required" },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (paystackData.status && paystackData.data.status === "success") {
      return NextResponse.json({
        status: true,
        message: "Payment verified successfully",
        data: {
          reference: paystackData.data.reference,
          amount: paystackData.data.amount / 100, // Convert from kobo to naira
          currency: paystackData.data.currency,
          status: paystackData.data.status,
          paid_at: paystackData.data.paid_at,
          customer: paystackData.data.customer,
          metadata: paystackData.data.metadata,
          gateway_response: paystackData.data.gateway_response,
        },
      });
    } else {
      return NextResponse.json(
        {
          status: false,
          message: paystackData.message || "Payment verification failed",
          data: paystackData.data,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Paystack verification error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
