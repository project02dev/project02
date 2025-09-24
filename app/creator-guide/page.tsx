"use client";
import Link from "next/link";

export default function CreatorGuidePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4 text-purple-700">Creator Guide</h1>
      <p className="mb-6 text-gray-700">
        Welcome, Creator! Here’s how to succeed on Project02:
      </p>
      <ul className="list-disc ml-6 mb-6 text-gray-700">
        <li>Set up your profile and showcase your expertise.</li>
        <li>Respond quickly to student requests and messages.</li>
        <li>Deliver quality work and earn positive reviews.</li>
        <li>Withdraw your earnings securely after project completion.</li>
        <li>Follow our community guidelines for a safe experience.</li>
      </ul>
      <div className="flex gap-4 mt-8">
        <Link
          href="/explore?category=custom"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          View Custom Projects
        </Link>
        <Link
          href="/help"
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Help
        </Link>
      </div>
    </div>
  );
}
