/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { paymentService } from "@/lib/services/paymentService";
import { FiCreditCard, FiLoader, FiCheck, FiX } from "react-icons/fi";

export default function TestPaymentPage() {
  const [user] = useAuthState(auth);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const testProject = {
    id: "test-project-123",
    title: "Test Project for Payment",
    price: 50, // $50 USD
    currency: "USD",
  };

  const handleTestPayment = async () => {
    if (!user) {
      setError("Please log in to test payment");
      return;
    }

    setIsProcessing(true);
    setError("");
    setResult(null);

    try {
      const result = await paymentService.initializePayment(
        testProject.id,
        user.uid,
        user.email || "",
        testProject.price,
        testProject.currency,
        "paystack"
      );

      if (result.success && result.data) {
        setResult(result.data);
        // Redirect to Paystack payment page
        window.location.href = result.data.paymentUrl;
      } else {
        setError(result.error || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("An error occurred while processing payment");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Test Page
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to test the payment system
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Test Paystack Payment
          </h1>

          {/* Test Project Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Test Project</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium">{testProject.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">
                  {testProject.currency} {testProject.price}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">Paystack</span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">User Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-medium text-xs">{user.uid}</span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <FiX className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <FiCheck className="w-5 h-5" />
                <span className="font-medium">Payment Initialized</span>
              </div>
              <div className="space-y-1 text-sm text-green-700">
                <p>Order ID: {result.orderId}</p>
                <p>Reference: {result.reference}</p>
                <p>Redirecting to Paystack...</p>
              </div>
            </div>
          )}

          {/* Test Payment Button */}
          <button
            onClick={handleTestPayment}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
          >
            {isProcessing ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin" />
                Initializing Payment...
              </>
            ) : (
              <>
                <FiCreditCard className="w-5 h-5" />
                Test Paystack Payment
              </>
            )}
          </button>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">
              Test Instructions:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • This will redirect you to Paystack&apos;s test payment page
              </li>
              <li>• Use test card: 4084084084084081</li>
              <li>• Any future date for expiry</li>
              <li>• Any 3-digit CVV</li>
              <li>• You&apos;ll be redirected back after payment</li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="mt-6 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
