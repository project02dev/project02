/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { FiCreditCard, FiLock, FiCheck } from "react-icons/fi";

interface PaymentFormProps {
  projectId: string;
  amount: number;
  projectTitle: string;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

export default function PaymentForm({
  projectId,
  amount,
  projectTitle,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [user] = useAuthState(auth);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      onError("Please log in to continue");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a mock order ID
      const orderId = `order_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // For demo purposes, always succeed
      onSuccess(orderId);
    } catch (error) {
      console.error("Payment error:", error);
      onError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCardData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">{projectTitle}</span>
          <span className="font-bold text-gray-900">${amount.toFixed(2)}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          required
          value={cardData.cardholderName}
          onChange={(e) => handleInputChange("cardholderName", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FiCreditCard className="inline w-4 h-4 mr-2" />
          Card Number
        </label>
        <input
          type="text"
          required
          value={cardData.cardNumber}
          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            required
            value={cardData.expiryDate}
            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="MM/YY"
            maxLength={5}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            type="text"
            required
            value={cardData.cvv}
            onChange={(e) => handleInputChange("cvv", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="123"
            maxLength={4}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FiLock className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          <>
            <FiCheck className="w-4 h-4" />
            Complete Purchase - ${amount.toFixed(2)}
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By completing this purchase, you agree to our Terms of Service and
        Privacy Policy. You will receive instant access to download the project
        files.
      </p>
    </form>
  );
}
