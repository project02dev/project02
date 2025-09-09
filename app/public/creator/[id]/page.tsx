/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { userService, analyticsService } from "@/lib/database";
import { UserProfile, CreatorStats } from "@/types/messaging";
import Image from "next/image";
import Link from "next/link";
import {
  FiStar,
  FiMapPin,
  FiCalendar,
  FiMessageCircle,
  FiExternalLink,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiMail,
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";

export default function PublicCreatorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [creator, setCreator] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"projects" | "about" | "reviews">(
    "projects"
  );

  const creatorId = params.id as string;

  useEffect(() => {
    if (creatorId) {
      fetchCreatorData();
    }
  }, [creatorId]);

  useEffect(() => {
    // Track profile view when user visits
    if (user && creatorId && user.uid !== creatorId) {
      analyticsService.trackCreatorProfileView(user.uid, creatorId);
    }
  }, [user, creatorId]);

  const fetchCreatorData = async () => {
    try {
      setIsLoading(true);

      // Fetch creator profile (public data only)
      const creatorProfile = await userService.getUserProfile(creatorId);
      if (creatorProfile) {
        setCreator(creatorProfile as unknown as UserProfile);

        // Fetch creator stats
        const creatorStats = await userService.getCreatorStats(creatorId);
        setStats(creatorStats);

        // Fetch creator projects (public projects only)
        const creatorProjects = await userService.getUserProjects(creatorId);
        setProjects(creatorProjects);
      }
    } catch (error) {
      console.error("Error fetching creator data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageClick = () => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/login?returnUrl=/public/creator/${creatorId}`);
      return;
    }

    if (user.uid === creatorId) {
      alert("You cannot message yourself!");
      return;
    }

    router.push(`/messages?user=${creatorId}`);
  };

  const handleProjectClick = (projectId: string) => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/auth/login?returnUrl=/project/${projectId}`);
      return;
    }
    router.push(`/project/${projectId}`);
  };

  const handleLikeProject = (projectId: string) => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/auth/login?returnUrl=/public/creator/${creatorId}`);
      return;
    }
    // Handle like functionality
    console.log("Like project:", projectId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Creator Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The creator profile you're looking for doesn't exist.
          </p>
          <Link
            href="/creators"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Creators
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Auth Banner for non-logged in users */}
      {!user && (
        <div className="bg-indigo-600 text-white py-3">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <p className="text-sm">
              Sign up to message creators and purchase projects
            </p>
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                <FiLogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <FiUserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col md:flex-row gap-6 flex-1">
              <div className="relative">
                <Image
                  src={creator.avatar || "/images/default-avatar.svg"}
                  alt={creator.fullName}
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
                {creator.isOnline && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {creator.fullName}
                    </h1>
                    {creator.username && (
                      <p className="text-lg text-gray-600 mb-3">
                        @{creator.username}
                      </p>
                    )}

                    {creator.bio && (
                      <p className="text-gray-700 mb-4 max-w-2xl">
                        {creator.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {creator.location && (
                        <div className="flex items-center gap-1">
                          <FiMapPin className="w-4 h-4" />
                          <span>{creator.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          Joined{" "}
                          {new Date(creator.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {creator.rating && (
                        <div className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>
                            {creator.rating.toFixed(1)} ({creator.reviewCount}{" "}
                            reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    {(creator.website ||
                      creator.github ||
                      creator.linkedin ||
                      creator.portfolio) && (
                      <div className="flex gap-3 mt-4">
                        {creator.website && (
                          <a
                            href={creator.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                          >
                            <FiGlobe className="w-5 h-5" />
                          </a>
                        )}
                        {creator.github && (
                          <a
                            href={creator.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                          >
                            <FiGithub className="w-5 h-5" />
                          </a>
                        )}
                        {creator.linkedin && (
                          <a
                            href={creator.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                          >
                            <FiLinkedin className="w-5 h-5" />
                          </a>
                        )}
                        {creator.portfolio && (
                          <a
                            href={creator.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                          >
                            <FiExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 mt-6 md:mt-0">
                    <button
                      onClick={handleMessageClick}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <FiMessageCircle className="w-4 h-4" />
                      {user ? "Send Message" : "Sign In to Message"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                  <FiAward className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalProjects}
                </div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                  <FiUsers className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalSales}
                </div>
                <div className="text-sm text-gray-600">Sales</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
                  <FiStar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.averageRating?.toFixed(1) || "0.0"}
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                  <FiCheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completionRate}%
                </div>
                <div className="text-sm text-gray-600">Completion</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-2">
                  <FiTrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalReviews}
                </div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-2">
                  <FiClock className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {stats.responseTime}
                </div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "projects", label: "Projects", count: projects.length },
                { id: "about", label: "About" },
                { id: "reviews", label: "Reviews" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "projects" && (
              <div>
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-indigo-600">
                            ${project.price}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeProject(project.id);
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              ❤️
                            </button>
                            <div className="flex items-center gap-1">
                              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm">
                                {project.rating || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        {!user && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              Sign in to purchase this project
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No projects available yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-6">
                {creator.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      About
                    </h3>
                    <p className="text-gray-700">{creator.bio}</p>
                  </div>
                )}

                {creator.skills && creator.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {creator.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {creator.workExperience &&
                  creator.workExperience.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Work Experience
                      </h3>
                      <div className="space-y-4">
                        {creator.workExperience.map((exp, index) => (
                          <div
                            key={index}
                            className="border-l-4 border-indigo-200 pl-4"
                          >
                            <h4 className="font-medium text-gray-900">
                              {exp.title}
                            </h4>
                            <p className="text-gray-600">{exp.company}</p>
                            <p className="text-sm text-gray-500">
                              {exp.startDate} -{" "}
                              {exp.current ? "Present" : exp.endDate}
                            </p>
                            {exp.description && (
                              <p className="text-gray-700 mt-2">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-12">
                <p className="text-gray-600">Reviews coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
