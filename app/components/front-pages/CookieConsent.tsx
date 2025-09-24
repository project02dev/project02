"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiShieldCheck, HiChevronDown, HiChevronUp } from "react-icons/hi";

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always enabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePreferenceChange = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Necessary cookies can't be disabled

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const savePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setIsVisible(false);

    // Initialize based on preferences
    if (preferences.analytics) initializeAnalytics();
    if (preferences.marketing) initializeMarketing();
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    setIsVisible(false);
    initializeAnalytics();
    initializeMarketing();
  };

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true, // Required for basic functionality
      analytics: false,
      marketing: false,
      preferences: false,
    };

    localStorage.setItem("cookieConsent", JSON.stringify(onlyNecessary));
    setIsVisible(false);
  };

  const initializeAnalytics = () => {
    // Your analytics initialization
    console.log("Analytics initialized");
  };

  const initializeMarketing = () => {
    // Your marketing cookies initialization
    console.log("Marketing cookies initialized");
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:max-w-md z-[100]"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <HiShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Cookie Preferences
                </h3>
              </div>
              <button
                onClick={rejectAll}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>

            {/* Main Content */}
            <p className="text-xs text-gray-600 mb-4">
              We use cookies to optimize your experience. Choose your
              preferences below.
            </p>

            {/* Preferences Toggle */}
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg mb-4 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Customize Preferences
              </span>
              {showPreferences ? (
                <HiChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <HiChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {/* Detailed Preferences */}
            <AnimatePresence>
              {showPreferences && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 mb-4"
                >
                  {[
                    {
                      key: "necessary" as const,
                      label: "Necessary",
                      description: "Required for basic site functionality",
                      alwaysOn: true,
                    },
                    {
                      key: "analytics" as const,
                      label: "Analytics",
                      description: "Help us improve our website",
                    },
                    {
                      key: "marketing" as const,
                      label: "Marketing",
                      description: "Personalized content and ads",
                    },
                    {
                      key: "preferences" as const,
                      label: "Preferences",
                      description: "Remember your settings",
                    },
                  ].map(({ key, label, description, alwaysOn }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          {label}
                        </div>
                        <div className="text-xs text-gray-600">
                          {description}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[key]}
                          onChange={() => handlePreferenceChange(key)}
                          disabled={alwaysOn}
                          className="sr-only"
                        />
                        <div
                          className={`w-11 h-6 rounded-full transition-colors ${
                            preferences[key] ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                              preferences[key] ? "transform translate-x-5" : ""
                            }`}
                          />
                        </div>
                      </label>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={rejectAll}
                className="flex-1 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Reject All
              </button>
              <button
                onClick={savePreferences}
                className="flex-1 px-4 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-medium text-sm"
              >
                Save Preferences
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium text-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
