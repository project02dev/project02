"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { paymentService } from "@/lib/services/paymentService";
import {
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
} from "react-icons/fi";

export default function PaymentCallback() {
  const [user] = useAuthState(auth);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment details from URL parameters
        const reference =
          searchParams.get("reference") || searchParams.get("tx_ref");
        const trxref = searchParams.get("trxref");
        const transaction_id = searchParams.get("transaction_id");

        // Determine payment method based on parameters
        let paymentMethod = "paystack";
        if (searchParams.get("tx_ref")) {
          paymentMethod = "flutterwave";
        }

        const paymentReference = reference || trxref || transaction_id;

        if (!paymentReference) {
          setStatus("error");
          setMessage("Payment reference not found");
          return;
        }

        // Extract order ID from reference (format: order_{orderId}_{timestamp})
        const orderIdMatch = paymentReference.match(/order_([^_]+)_/);
        const extractedOrderId = orderIdMatch ? orderIdMatch[1] : "";

        if (!extractedOrderId) {
          setStatus("error");
          setMessage("Invalid payment reference format");
          return;
        }

        setOrderId(extractedOrderId);

        // Verify payment
        const result = await paymentService.verifyPayment(
          extractedOrderId,
          paymentReference,
          paymentMethod
        );

        if (result.success) {
          setStatus("success");
          setMessage("Payment successful! Your purchase has been completed.");

          // Redirect to dashboard after 5 seconds
          setTimeout(() => {
            router.push("/dashboard?tab=purchases");
          }, 5000);
        } else {
          setStatus("error");
          setMessage(result.error || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setMessage("An error occurred while verifying your payment");
      }
    };

    if (searchParams.toString()) {
      verifyPayment();
    }
  }, [searchParams, router]);

  const handleReturnToDashboard = () => {
    router.push("/dashboard");
  };

  const handleRetryPayment = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <FiLoader className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying Payment
            </h1>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your payment...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <FiCheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={handleReturnToDashboard}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </button>
              <p className="text-sm text-gray-500">
                Redirecting automatically in 3 seconds...
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <FiXCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetryPayment}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleReturnToDashboard}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <FiArrowLeft className="w-4 h-4" />
                Return to Dashboard
              </button>
            </div>
          </>
        )}

        {orderId && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
