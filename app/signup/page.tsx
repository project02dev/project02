/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginOptions } from "@/components/common/LoginOptions";
import { StageAccount } from "@/components/front-pages/signup/StageAccount";
import { StageProfile } from "@/components/front-pages/signup/StageProfile";
import { StageVerification } from "@/components/front-pages/signup/StageVerification";
import { signInWithGoogle, signInWithGithub } from "@/lib/firebase/auth";

interface FormData {
  university: any;
  department: any;
  verificationType: any;
  fullName?: string;
  email?: string;
  password?: string;
  username?: string;
  country?: string;
  phone?: string;
  dob?: string;
  documents?: {
    id?: File;
    education?: File;
    professional?: File;
  };
}

type Role = "student" | "creator";

const roles: Array<{ id: Role; label: string }> = [
  { id: "student", label: "Student" },
  { id: "creator", label: "Creator" },
];

export default function SignupPage() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(0);
  const [role, setRole] = useState<Role>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    university: undefined,
    department: undefined,
    verificationType: undefined,
    fullName: "",
    email: "",
    password: "",
    username: "",
    country: "",
    phone: "",
    dob: "",
    documents: {
      id: undefined,
      education: undefined,
      professional: undefined,
    },
  });
  const [verificationTypes, setVerificationTypes] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      allowedFileTypes: string;
    }>
  >([]);

  useEffect(() => {
    const loadVerificationTypes = async () => {
      try {
        const response = await fetch("/api/verification-types");
        const data = await response.json();
        setVerificationTypes(data);
      } catch (error) {
        console.error("Error loading verification types:", error);
        toast.error("Failed to load verification types");
      }
    };
    loadVerificationTypes();
  }, []);

  const handleOAuth = async (provider: "Google" | "GitHub") => {
    try {
      setIsLoading(true);
      const authFunction =
        provider === "Google" ? signInWithGoogle : signInWithGithub;

      // Add a timeout to handle popup blocks
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Authentication timed out")), 60000);
      });

      const authPromise = authFunction();
      const result = await Promise.race([authPromise, timeoutPromise]);

      // Type assertion for the result
      const { user, isNewUser } = result as { user: any; isNewUser: boolean };

      if (!user) {
        throw new Error("No user data received");
      }

      if (isNewUser) {
        // Create user profile in your database
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create user profile");
        }

        toast.success("Account created successfully!");
      } else {
        toast.success(`Welcome back! Signed in with ${provider}`);
      }

      // Use router.replace instead of push to prevent back navigation
      await router.replace("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error cases
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes("popup")) {
          toast.error("Popup was blocked. Please allow popups and try again.");
        } else if (errorMessage.includes("cancelled")) {
          toast.error("Authentication was cancelled. Please try again.");
        } else if (errorMessage.includes("timeout")) {
          toast.error("Authentication timed out. Please try again.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Authentication failed. Please try again.");
      }
      console.error("OAuth Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Import Firebase Auth functions
      const { createUserWithEmailAndPassword, updateProfile } = await import(
        "firebase/auth"
      );
      const { auth } = await import("@/lib/firebase/config");

      // Create user with Firebase Auth
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required.");
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.fullName,
      });

      // Prepare user data for API
      const userData = {
        uid: userCredential.user.uid,
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        role: role,
        dob: formData.dob,
        country: formData.country,
        phone: formData.phone,
        university: formData.university,
        department: formData.department,
        verificationType: formData.verificationType,
      };

      // Store additional user data via API
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create user profile");
      }

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Signup Error:", error);

      // Handle Firebase specific errors
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Please choose a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nextStage = () => setCurrentStage(currentStage + 1);
  const prevStage = () => setCurrentStage(currentStage - 1);

  const stages = [
    {
      title: "Create Your Account",
      component: (
        <StageAccount
          formData={formData}
          setFormData={setFormData}
          nextStage={nextStage}
        />
      ),
    },
    {
      title: "Profile Information",
      component: (
        <StageProfile
          formData={formData}
          setFormData={setFormData}
          nextStage={nextStage}
          prevStage={prevStage}
        />
      ),
    },
    {
      title: "Verification",
      component: (
        <StageVerification
          formData={formData}
          setFormData={setFormData}
          prevStage={prevStage}
          onSubmit={handleSubmit}
          verificationTypes={verificationTypes}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative">
      {/* Bottom Fade Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200/60">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{
                width: `${((currentStage + 1) / stages.length) * 100}%`,
              }}
            />
          </div>

          <div className="p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/favicon.png"
                alt="Logo"
                width={80}
                height={60}
                className="mb-6"
                priority
              />
            </div>

            {/* Title and Subtitle */}
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              {stages[currentStage].title}
            </h2>
            <p className="text-center text-gray-500 mb-6">
              {currentStage === 0
                ? "Join Project02 and start your journey"
                : "Step " + (currentStage + 1) + " of " + stages.length}
            </p>

            {/* Rest of your existing content */}
            {/* OAuth Buttons - Only show on first stage */}
            {currentStage === 0 && (
              <>
                <LoginOptions
                  onGoogleClick={() => handleOAuth("Google")}
                  onGithubClick={() => handleOAuth("GitHub")}
                  className="mb-6"
                />
                {isLoading && (
                  <div className="text-center text-sm text-gray-600 mb-4">
                    Please wait while we authenticate you...
                  </div>
                )}

                <div className="flex items-center my-6">
                  <hr className="flex-grow border-gray-300/50" />
                  <span className="px-3 text-gray-500 text-sm">
                    or continue with email
                  </span>
                  <hr className="flex-grow border-gray-300/50" />
                </div>
              </>
            )}

            {/* Current Stage Component */}
            {stages[currentStage].component}

            {/* Role Selection - Only show on first stage */}
            {currentStage === 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200/50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I&apos;m signing up as a *
                </label>
                <div className="flex gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition ${
                        role === r.id
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white/80 text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Terms - Only show on first stage */}
            {currentStage === 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200/50">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="text-indigo-600 hover:underline"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-indigo-600 hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
            )}

            {/* Login link - Only show on first stage */}
            {currentStage === 0 && (
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <a href="/login" className="text-indigo-600 hover:underline">
                  Log in
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
