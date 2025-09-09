"use client";

import { useRouter } from "next/navigation";
import { FiXCircle, FiArrowLeft, FiRefreshCw } from "react-icons/fi";

export default function PaymentCancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <FiXCircle className="w-20 h-20 text-red-600 mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges have been made to your account.
          You can try again or continue browsing our projects.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Try Payment Again
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> Contact our support team if you&apos;re
            experiencing issues with payment processing.
          </p>
        </div>
      </div>
    </div>
  );
}
