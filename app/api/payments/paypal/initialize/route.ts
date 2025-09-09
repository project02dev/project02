/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.paypal.com"
    : "https://api.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { success: false, error: "PayPal credentials not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount, currency, orderId, returnUrl, cancelUrl } = body;

    // Validate required fields
    if (!amount || !currency || !orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const paypalResponse = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: orderId,
              amount: {
                currency_code: currency.toUpperCase(),
                value: amount.toFixed(2),
              },
              description: "Academic Project Purchase",
            },
          ],
          application_context: {
            return_url:
              returnUrl ||
              `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
            cancel_url:
              cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
            brand_name: "Project02",
            landing_page: "BILLING",
            user_action: "PAY_NOW",
          },
        }),
      }
    );

    const paypalData = await paypalResponse.json();

    if (paypalResponse.ok && paypalData.id) {
      const approvalUrl = paypalData.links.find(
        (link: any) => link.rel === "approve"
      )?.href;

      return NextResponse.json({
        success: true,
        orderId: paypalData.id,
        approvalUrl,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: paypalData.message || "Failed to create PayPal order",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("PayPal initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
