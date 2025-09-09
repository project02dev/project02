import { NextRequest, NextResponse } from "next/server";
import { currencyService } from "@/lib/services/currencyService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get("amount");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!amount || !from || !to) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required parameters: amount, from, to" 
        },
        { status: 400 }
      );
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid amount provided" 
        },
        { status: 400 }
      );
    }

    // Currently only support USD to NGN conversion
    if (from !== "USD" || to !== "NGN") {
      return NextResponse.json(
        { 
          success: false, 
          error: "Only USD to NGN conversion is currently supported" 
        },
        { status: 400 }
      );
    }

    const conversion = await currencyService.convertUSDToNGN(numAmount);

    return NextResponse.json({
      success: true,
      data: {
        originalAmount: numAmount,
        originalCurrency: from,
        convertedAmount: conversion.ngnAmount,
        convertedCurrency: to,
        exchangeRate: conversion.exchangeRate,
        convertedAt: conversion.convertedAt,
        formatted: {
          original: currencyService.formatCurrency(numAmount, "USD"),
          converted: currencyService.formatCurrency(conversion.ngnAmount, "NGN"),
        },
      },
    });
  } catch (error) {
    console.error("Currency conversion error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error during currency conversion" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, from, to } = body;

    if (!amount || !from || !to) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: amount, from, to" 
        },
        { status: 400 }
      );
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid amount provided" 
        },
        { status: 400 }
      );
    }

    // Support both USD to NGN and NGN to USD
    let conversion;
    
    if (from === "USD" && to === "NGN") {
      conversion = await currencyService.convertUSDToNGN(numAmount);
      return NextResponse.json({
        success: true,
        data: {
          originalAmount: numAmount,
          originalCurrency: from,
          convertedAmount: conversion.ngnAmount,
          convertedCurrency: to,
          exchangeRate: conversion.exchangeRate,
          convertedAt: conversion.convertedAt,
          formatted: {
            original: currencyService.formatCurrency(numAmount, "USD"),
            converted: currencyService.formatCurrency(conversion.ngnAmount, "NGN"),
          },
        },
      });
    } else if (from === "NGN" && to === "USD") {
      conversion = await currencyService.convertNGNToUSD(numAmount);
      return NextResponse.json({
        success: true,
        data: {
          originalAmount: numAmount,
          originalCurrency: from,
          convertedAmount: conversion.usdAmount,
          convertedCurrency: to,
          exchangeRate: conversion.exchangeRate,
          convertedAt: conversion.convertedAt,
          formatted: {
            original: currencyService.formatCurrency(numAmount, "NGN"),
            converted: currencyService.formatCurrency(conversion.usdAmount, "USD"),
          },
        },
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: "Only USD ⇄ NGN conversion is currently supported" 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Currency conversion error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error during currency conversion" 
      },
      { status: 500 }
    );
  }
}
