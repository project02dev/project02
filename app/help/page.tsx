"use client";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">
        How Our System Works
      </h1>
      <p className="mb-6 text-gray-700">
        Project02 is an academic marketplace connecting students and creators.
        Students can search, request, and purchase custom academic projects.
        Creators can showcase their skills and earn by delivering quality work.
      </p>
      <ul className="list-disc ml-6 mb-6 text-gray-700">
        <li>Browse or search for projects by category or keyword.</li>
        <li>Request a custom project if you can&apos;t find what you need.</li>
        <li>Chat securely with creators before making a purchase.</li>
        <li>Track your orders and messages in your dashboard.</li>
        <li>Creators get paid after successful delivery and review.</li>
      </ul>
      <div className="flex gap-4 mt-8">
        <Link
          href="/explore"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Explore Projects
        </Link>
        <Link
          href="/creator-guide"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Creator Guide
        </Link>
        <Link
          href="/privacy"
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
