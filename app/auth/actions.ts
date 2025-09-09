/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { auth } from "@/lib/firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { z } from "zod";

// Define the schema for validation using Zod
const signupSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["student", "creator"], { message: "You must select a role" }),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function signup(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // 1. Validate form data
    const validatedFields = signupSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return {
        message: "Invalid form data.",
        fields: prevState.fields,
        issues: validatedFields.error.issues.map((issue) => issue.message),
      };
    }

    const { fullName, username, email, password, role } = validatedFields.data;

    // 2. Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 3. Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: fullName,
    });

    // 4. Store additional user data in Firestore
    const { doc, setDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase/config");

    await setDoc(doc(db, "users", userCredential.user.uid), {
      fullName,
      username,
      email,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      message: "Account created successfully! You can now log in.",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Signup Error:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-in-use") {
      return { message: "This email is already registered." };
    }

    return {
      message: error.message || "An error occurred during signup.",
    };
  }
}

// Helper function to check if username exists
async function checkUsernameExists(username: string): Promise<boolean> {
  const { collection, query, where, getDocs } = await import(
    "firebase/firestore"
  );
  const { db } = await import("@/lib/firebase/config");

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
}
