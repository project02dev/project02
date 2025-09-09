/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

// Nigerian bank codes for validation
const NIGERIAN_BANKS: { [code: string]: string } = {
  "044": "Access Bank",
  "014": "Afribank Nigeria Plc",
  "023": "Citibank Nigeria Limited",
  "063": "Diamond Bank Plc",
  "050": "Ecobank Nigeria Plc",
  "084": "Enterprise Bank Limited",
  "070": "Fidelity Bank Plc",
  "011": "First Bank of Nigeria Limited",
  "214": "First City Monument Bank Plc",
  "058": "Guaranty Trust Bank Plc",
  "030": "Heritage Banking Company Ltd",
  "082": "Keystone Bank Limited",
  "076": "Skye Bank Plc",
  "068": "Standard Chartered Bank Nigeria Limited",
  "232": "Sterling Bank Plc",
  "032": "Union Bank of Nigeria Plc",
  "033": "United Bank for Africa Plc",
  "215": "Unity Bank Plc",
  "035": "Wema Bank Plc",
  "057": "Zenith Bank Plc",
  "221": "Stanbic IBTC Bank Plc",
  "304": "Stanbic Mobile Money",
  "100": "Suntrust Bank Nigeria Limited",
  "501": "FSDH Merchant Bank Limited",
  "601": "FINCA Microfinance Bank Limited",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bankDetailsId,
      accountNumber,
      bankCode,
      bankName,
    }: {
      bankDetailsId: string;
      accountNumber: string;
      bankCode?: string;
      bankName?: string;
    } = body;

    if (!bankDetailsId || !accountNumber) {
      return NextResponse.json(
        { error: "Bank details ID and account number are required" },
        { status: 400 }
      );
    }

    // Validate account number format (Nigerian account numbers are typically 10 digits)
    if (!/^\d{10}$/.test(accountNumber)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid account number format. Must be 10 digits.",
        },
        { status: 400 }
      );
    }

    // Validate bank code if provided
    if (bankCode && !NIGERIAN_BANKS[bankCode]) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid bank code",
        },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Call a bank verification API (like Paystack, Flutterwave, or direct bank APIs)
    // 2. Verify the account number against the account name
    // 3. Check if the account is active and can receive transfers

    // For now, we'll simulate verification
    const isValid = await simulateBankVerification(
      accountNumber,
      bankName ?? ""
    );

    if (!isValid.success) {
      return NextResponse.json({
        success: false,
        message: isValid.message,
      });
    }

    // Update bank details as verified
    await updateDoc(doc(db, "bankDetails", bankDetailsId), {
      isVerified: true,
      updatedAt: serverTimestamp(),
      verificationData: {
        verifiedAt: serverTimestamp(),
        verificationMethod: "api_verification",
        verificationReference: `VER_${Date.now()}_${bankDetailsId.slice(-6)}`,
        accountNameMatch: isValid.accountNameMatch,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Bank details verified successfully",
      verificationData: {
        accountNameMatch: isValid.accountNameMatch,
        verificationReference: `VER_${Date.now()}_${bankDetailsId.slice(-6)}`,
      },
    });
  } catch (error) {
    console.error("Bank verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Simulate bank verification (replace with real API integration)
async function simulateBankVerification(
  accountNumber: string,
  bankName: string
): Promise<{
  success: boolean;
  message: string;
  accountNameMatch?: boolean;
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate different scenarios based on account number
  const lastDigit = parseInt(accountNumber.slice(-1));

  if (lastDigit === 0) {
    // Simulate invalid account
    return {
      success: false,
      message: "Account number does not exist or is inactive",
    };
  }

  if (lastDigit === 1) {
    // Simulate account name mismatch
    return {
      success: false,
      message: "Account name does not match the provided details",
    };
  }

  // Simulate successful verification
  return {
    success: true,
    message: "Account verified successfully",
    accountNameMatch: true,
  };
}

// Get list of supported banks
export async function GET() {
  return NextResponse.json({
    success: true,
    banks: Object.entries(NIGERIAN_BANKS).map(([code, name]) => ({
      code,
      name,
    })),
  });
}
