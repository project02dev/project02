"use client";

import Link from "next/link";
import {
  FiHome,
  FiSearch,
  FiMessageCircle,
  FiUser,
  FiArrowRight,
} from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
        {/* Animated 404 Graphic */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-10 blur-xl"></div>
          </div>
          <div className="relative">
            <div className="inline-flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-lg transform rotate-6"></div>
                <div className="absolute inset-0 flex items-center justify-center transform -rotate-6">
                  <span className="text-6xl font-bold text-white">404</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          The page you&apos;re looking for seems to have wandered off into the
          digital void. Don&apos;t worry, we&apos;ll help you find your way back
          to familiar territory.
        </p>

        {/* Main Action Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
          >
            <FiHome className="w-5 h-5" />
            Return to Homepage
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/explore"
            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FiSearch className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-700">
                Explore Projects
              </span>
            </div>
            <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-200 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FiUser className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-medium text-gray-700">Dashboard</span>
            </div>
            <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </Link>

          <Link
            href="/messages"
            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-green-200 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FiMessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-medium text-gray-700">Messages</span>
            </div>
            <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
          </Link>

          <Link
            href="/contact"
            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-orange-50 rounded-xl border border-gray-200 hover:border-orange-200 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {/*  */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Contact Support</span>
            </div>
            <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
          </Link>
        </div>

        {/* Support Text */}
        <p className="text-sm text-gray-500">
          Still lost? Our support team is here to help.{" "}
          <Link
            href="/contact"
            className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
          >
            Get in touch
          </Link>
        </p>
      </div>
    </div>
  );
}
