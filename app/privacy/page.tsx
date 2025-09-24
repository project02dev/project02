"use client";
export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">
        Privacy Policy
      </h1>
      <p className="mb-6 text-gray-700">
        We value your privacy. Your data is securely stored and never shared
        with third parties except as required for service delivery. All messages
        and transactions are encrypted.
      </p>
      <ul className="list-disc ml-6 mb-6 text-gray-700">
        <li>
          We collect only necessary information for account and project
          management.
        </li>
        <li>All payments are processed securely via Stripe or Paystack.</li>
        <li>You can request account deletion at any time.</li>
        <li>Contact support for any privacy concerns.</li>
      </ul>
      <p className="text-gray-500 mt-8">Last updated: September 2025</p>
    </div>
  );
}
