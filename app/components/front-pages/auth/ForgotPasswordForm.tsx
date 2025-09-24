/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { SuccessMessage } from "./SuccessMessage";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      // Firebase returns error code "auth/user-not-found" if email doesn't exist
      if (err.code === "auth/user-not-found") {
        setError("No account found with that email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="rounded-lg bg-green-50 p-6 border border-green-200 text-green-900 shadow text-left">
          <div className="flex items-center mb-2">
            <svg
              className="h-5 w-5 text-green-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" fill="#22c55e" />
              <path
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4"
              />
            </svg>
            <span className="font-semibold">Check your email</span>
          </div>
          <p className="mb-2">
            We've sent a password reset link to{" "}
            <span className="font-semibold">{email}</span>.
          </p>
          <p className="text-sm text-green-700 mb-2">
            If you don't see it, please check your{" "}
            <span className="font-semibold">Spam</span> or{" "}
            <span className="font-semibold">Junk</span> folder.
          </p>
          <button
            className="mt-2 text-indigo-700 hover:underline font-medium"
            onClick={() => router.push("/login")}
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center">
        <Image
          src="/favicon.png" // Replace with your logo
          alt="Company Logo"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-center">
          Forgot your password?
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </div>
      </form>

      <div className="text-center text-sm">
        <button
          onClick={() => router.push("/login")}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Remember your password? Sign in
        </button>
      </div>
    </div>
  );
}
