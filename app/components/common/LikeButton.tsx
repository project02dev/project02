/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { likesService } from "@/lib/services/likesService";
import { analyticsService } from "@/lib/database";
import { FiHeart } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  projectId: string;
  creatorId?: string; // <-- add this line
  initialLiked?: boolean;
  initialCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export default function LikeButton({
  projectId,
  creatorId, // <-- add this line
  initialLiked = false,
  initialCount = 0,
  size = "md",
  showCount = true,
  className = "",
}: LikeButtonProps) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has liked this project
    if (user && projectId) {
      checkUserLike();
    }
  }, [user, projectId]);

  const checkUserLike = async () => {
    if (!user) return;

    try {
      const hasLiked = await likesService.hasUserLiked(projectId, user.uid);
      setIsLiked(hasLiked);

      // Get current likes count
      const count = await likesService.getProjectLikesCount(projectId);
      setLikesCount(count);
    } catch (error) {
      console.error("Error checking user like:", error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const result = await likesService.toggleLike(projectId, user.uid);

      if (result.success) {
        setIsLiked(result.isLiked);
        setLikesCount(result.totalLikes);

        // Track analytics for like/unlike
        if (creatorId) {
          analyticsService.trackProjectLike(
            user.uid,
            projectId,
            creatorId,
            result.isLiked
          );
        }

        // Trigger animation
        setTimeout(() => setIsAnimating(false), 300);
      } else {
        console.error("Error toggling like:", result.error);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-5 h-5";
    }
  };

  const getButtonClasses = () => {
    const baseClasses =
      "flex items-center gap-1 transition-all duration-200 rounded-lg";
    const sizeClasses =
      size === "sm" ? "px-2 py-1" : size === "lg" ? "px-4 py-2" : "px-3 py-1.5";

    if (isLiked) {
      return `${baseClasses} ${sizeClasses} text-red-600 hover:text-red-700 hover:bg-red-50 ${className}`;
    }

    return `${baseClasses} ${sizeClasses} text-gray-600 hover:text-red-600 hover:bg-gray-50 ${className}`;
  };

  const getTextClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={getButtonClasses()}
      title={isLiked ? "Unlike this project" : "Like this project"}
    >
      <div className="relative">
        <FiHeart
          className={`${getSizeClasses()} transition-all duration-200 ${
            isLiked ? "fill-current" : ""
          } ${isAnimating ? "scale-125" : "scale-100"}`}
        />

        {/* Animated heart effect */}
        {isAnimating && isLiked && (
          <div className="absolute inset-0 animate-ping">
            <FiHeart
              className={`${getSizeClasses()} text-red-400 fill-current`}
            />
          </div>
        )}
      </div>

      {showCount && (
        <span className={`${getTextClasses()} font-medium`}>
          {likesCount.toLocaleString()}
        </span>
      )}
    </button>
  );
}

// Compact version for use in cards
export function CompactLikeButton({
  projectId,
  creatorId,
  initialLiked = false,
  initialCount = 0,
}: {
  projectId: string;
  creatorId?: string;
  initialLiked?: boolean;
  initialCount?: number;
}) {
  return (
    <LikeButton
      projectId={projectId}
      creatorId={creatorId}
      initialLiked={initialLiked}
      initialCount={initialCount}
      size="sm"
      showCount={true}
      className="border border-gray-200 hover:border-red-200"
    />
  );
}

// Large version for project detail pages
export function LargeLikeButton({
  projectId,
  initialLiked = false,
  initialCount = 0,
}: {
  projectId: string;
  initialLiked?: boolean;
  initialCount?: number;
}) {
  return (
    <LikeButton
      projectId={projectId}
      initialLiked={initialLiked}
      initialCount={initialCount}
      size="lg"
      showCount={true}
      className="border border-gray-200 hover:border-red-200 bg-white"
    />
  );
}

// Icon only version
export function IconLikeButton({
  projectId,
  initialLiked = false,
}: {
  projectId: string;
  initialLiked?: boolean;
}) {
  return (
    <LikeButton
      projectId={projectId}
      initialLiked={initialLiked}
      size="md"
      showCount={false}
      className="p-2 rounded-full hover:bg-gray-100"
    />
  );
}
