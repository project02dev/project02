/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { paymentService } from "@/lib/services/paymentService";
import { Project } from "@/types/database";
import Image from "next/image";
import {
  FiX,
  FiCreditCard,
  FiDollarSign,
  FiShield,
  FiCheck,
  FiLoader,
} from "react-icons/fi";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSuccess: (orderId: string) => void;
}

const paymentMethods = [
  {
    id: "paystack",
    name: "Paystack",
    description: "Pay with card, bank transfer, or mobile money",
    icon: "💳",
    fees: "2.9% + ₦15",
    currencies: ["NGN", "USD", "GHS", "ZAR"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Pay with credit/debit card",
    icon: "💎",
    fees: "2.9% + $0.30",
    currencies: ["USD", "EUR", "GBP"],
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Pay with PayPal account or card",
    icon: "🅿️",
    fees: "3.4% + $0.30",
    currencies: ["USD", "EUR", "GBP"],
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    description: "Pay with card, bank, or mobile money",
    icon: "🌊",
    fees: "3.8%",
    currencies: ["NGN", "USD", "GHS", "KES"],
  },
];

export default function PaymentModal({
  isOpen,
  onClose,
  project,
  onSuccess,
}: PaymentModalProps) {
  const [user] = useAuthState(auth);
  const [selectedMethod, setSelectedMethod] = useState("paystack");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"select" | "processing" | "success">(
    "select"
  );

  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setError("");
      setSelectedMethod("paystack");
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!user) {
      setError("Please log in to make a purchase");
      return;
    }

    setIsProcessing(true);
    setError("");
    setStep("processing");

    try {
      const result = await paymentService.initializePayment(
        project.id,
        user.uid,
        user.email || "",
        project.price,
        project.currency || "USD",
        selectedMethod as any
      );

      if (result.success && result.data) {
        // Redirect to payment gateway
        window.location.href = result.data.paymentUrl;
      } else {
        setError(result.error || "Failed to initialize payment");
        setStep("select");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("An error occurred while processing payment");
      setStep("select");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    const method = paymentMethods.find((m) => m.id === selectedMethod);
    if (!method) return project.price;

    // Simple fee calculation (in real app, this would be more sophisticated)
    let fee = 0;
    if (selectedMethod === "paystack") {
      fee = project.price * 0.029 + (project.currency === "NGN" ? 0.15 : 0.15);
    } else if (selectedMethod === "stripe") {
      fee = project.price * 0.029 + 0.3;
    } else if (selectedMethod === "paypal") {
      fee = project.price * 0.034 + 0.3;
    } else if (selectedMethod === "flutterwave") {
      fee = project.price * 0.038;
    }

    return project.price + fee;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Complete Purchase</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Project Summary */}
          <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {project.thumbnailUrl ? (
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FiCreditCard className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                by {project.creatorName}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-600">
                  ${project.price.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">
                  {project.currency}
                </span>
              </div>
            </div>
          </div>

          {step === "select" && (
            <>
              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Choose Payment Method
                </h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMethod === method.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {method.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            Fee: {method.fees}
                          </div>
                        </div>
                        {selectedMethod === method.id && (
                          <FiCheck className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Project Price</span>
                  <span>${project.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Processing Fee</span>
                  <span>${(calculateTotal() - project.price).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span className="text-lg">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-lg">
                <FiShield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">
                  Your payment is secured with 256-bit SSL encryption
                </span>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiDollarSign className="w-4 h-4" />
                      Pay ${calculateTotal().toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {step === "processing" && (
            <div className="text-center py-8">
              <FiLoader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Redirecting to Payment Gateway
              </h3>
              <p className="text-gray-600">
                Please wait while we redirect you to complete your payment...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
