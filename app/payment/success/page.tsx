"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard?tab=purchases");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <FiCheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your purchase! Your payment has been processed successfully 
          and you now have access to your project.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/dashboard?tab=purchases")}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            View My Purchases
            <FiArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Redirecting to your dashboard in 5 seconds...
        </p>
      </div>
    </div>
  );
}
