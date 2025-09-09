import { NextRequest, NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "Stripe secret key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount, currency, orderId, customerEmail, successUrl, cancelUrl } = body;

    // Validate required fields
    if (!amount || !currency || !orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[0]": "card",
        "line_items[0][price_data][currency]": currency.toLowerCase(),
        "line_items[0][price_data][product_data][name]": "Academic Project Purchase",
        "line_items[0][price_data][unit_amount]": amount.toString(),
        "line_items[0][quantity]": "1",
        mode: "payment",
        success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        "metadata[orderId]": orderId,
        ...(customerEmail && { customer_email: customerEmail }),
      }),
    });

    const stripeData = await stripeResponse.json();

    if (stripeResponse.ok && stripeData.id) {
      return NextResponse.json({
        success: true,
        sessionId: stripeData.id,
        url: stripeData.url,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: stripeData.error?.message || "Failed to create checkout session",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Stripe initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
