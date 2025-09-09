"use client";

import React, { useState } from 'react';
import { FiShare2, FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';

interface ShareProfileLinkProps {
  userId: string;
  userName: string;
}

export default function ShareProfileLink({ userId, userName }: ShareProfileLinkProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const profileUrl = `${window.location.origin}/public/creator/${userId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = profileUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userName}'s Profile`,
          text: `Check out ${userName}'s projects and portfolio`,
          url: profileUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleOpenProfile = () => {
    window.open(profileUrl, '_blank');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiShare2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Share Your Profile</h3>
            <p className="text-sm text-gray-600">
              Share your public profile link with potential clients
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Profile URL Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Public Profile Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copied ? (
                  <div className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4" />
                    Copied!
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FiCopy className="w-4 h-4" />
                    Copy
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <FiShare2 className="w-4 h-4" />
              Share Profile
            </button>
            <button
              onClick={handleOpenProfile}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FiExternalLink className="w-4 h-4" />
              Preview
            </button>
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Benefits of sharing your profile:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Potential clients can view your work without signing up</li>
              <li>• Showcase your projects and skills publicly</li>
              <li>• Increase your visibility and reach</li>
              <li>• Easy to share on social media and portfolios</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Share Your Profile
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}
                  >
                    {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=Check out my profile&url=${encodeURIComponent(profileUrl)}`, '_blank');
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Share on Twitter
                </button>
                <button
                  onClick={() => {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, '_blank');
                  }}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
                >
                  Share on LinkedIn
                </button>
                <button
                  onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Share on Facebook
                </button>
                <button
                  onClick={() => {
                    window.open(`mailto:?subject=Check out my profile&body=Hi! Check out my profile and projects: ${profileUrl}`, '_blank');
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Share via Email
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleOpenProfile}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Preview Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
