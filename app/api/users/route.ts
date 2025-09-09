/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase/config";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Here you would typically save the user data to your database
    // For example, using Firestore or your preferred database

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
