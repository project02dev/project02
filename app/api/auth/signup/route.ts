/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// This API route is for storing additional user data after Firebase Auth user creation
// The actual user creation should be done on the client side using Firebase Auth

const userDataSchema = z.object({
  uid: z.string(),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  role: z.enum(["student", "creator"], { message: "You must select a role" }),
  dob: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  university: z.string().optional(),
  department: z.string().optional(),
  verificationType: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse JSON data (not FormData since we're not handling file uploads here)
    const data = await request.json();

    // Validate data
    const validatedFields = userDataSchema.safeParse(data);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Invalid user data.",
          issues: validatedFields.error.issues.map((issue) => issue.message),
        },
        { status: 400 }
      );
    }

    const { uid, fullName, username, email, role, ...additionalData } =
      validatedFields.data;

    // Import Firestore functions dynamically to avoid SSR issues
    const { doc, setDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase/config");

    // Store user data in Firestore
    const userData = {
      fullName,
      username,
      email,
      role,
      ...additionalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatar: "",
      bio: "",
      skills: [],
      workExperience: [],
      education: [],
      isOnline: false,
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        messageNotifications: true,
      },
    };

    await setDoc(doc(db, "users", uid), userData);

    return NextResponse.json({
      message: "User profile created successfully!",
      success: true,
    });
  } catch (error: any) {
    console.error("User data storage error:", error);

    return NextResponse.json(
      {
        message: error.message || "An error occurred while storing user data.",
      },
      { status: 500 }
    );
  }
}
