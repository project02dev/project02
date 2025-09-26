/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { userService } from "@/lib/services/userService";
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
} from "react-icons/fi";

export default function CreatorProfilePage() {
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
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user && creatorId) {
      fetchCreatorData();
    }
  }, [user, loading, creatorId, router]);

  const fetchCreatorData = async () => {
    try {
      setIsLoading(true);

      // Fetch creator profile
      const creatorProfile = await userService.getUserProfile(creatorId);
      if (!creatorProfile) {
        router.push("/creators");
        return;
      }
      setCreator(creatorProfile);

      // Fetch creator stats
      const creatorStats = await userService.getCreatorStats(creatorId);
      setStats(creatorStats);

      // Fetch creator projects
      const creatorProjects = await userService.getUserProjects(creatorId);
      setProjects(creatorProjects);
    } catch (error) {
      console.error("Error fetching creator data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageClick = () => {
    if (user && creatorId === user.uid) {
      alert("You cannot message yourself!");
      return;
    }
    router.push(`/messages?user=${creatorId}`);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Creator not found
          </h2>
          <p className="text-gray-600 mb-4">
            The creator you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/creators"
            className="px-4 py-2 btn-primary"
          >
            Back to Creators
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
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
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {creator.fullName}
                    </h1>
                    {creator.username && (
                      <p className="text-lg text-gray-600">
                        @{creator.username}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {creator.location && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <FiMapPin className="w-4 h-4" />
                          <span>{creator.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-gray-600">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          Joined{" "}
                          {new Date(creator.joinedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {creator.rating && (
                        <div className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">
                            {creator.rating.toFixed(1)}
                          </span>
                          <span className="text-gray-600">
                            ({creator.reviewCount || 0} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-3 mt-4">
                      {creator.website && (
                        <a
                          href={creator.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-green-700 transition-colors"
                        >
                          <FiGlobe className="w-5 h-5" />
                        </a>
                      )}
                      {creator.github && (
                        <a
                          href={creator.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-green-700 transition-colors"
                        >
                          <FiGithub className="w-5 h-5" />
                        </a>
                      )}
                      {creator.linkedin && (
                        <a
                          href={creator.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-green-700 transition-colors"
                        >
                          <FiLinkedin className="w-5 h-5" />
                        </a>
                      )}
                      {creator.email && (
                        <a
                          href={`mailto:${creator.email}`}
                          className="text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                          <FiMail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 mt-6 md:mt-0">
                    {user && creatorId !== user.uid && (
                      <button
                        onClick={handleMessageClick}
                        className="px-6 py-3 btn-primary rounded-lg flex items-center gap-2"
                      >
                        <FiMessageCircle className="w-4 h-4" />
                        Send Message
                      </button>
                    )}
                    <Link
                      href={`/creators/${creatorId}/projects`}
                      className="px-6 py-3 border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 text-center"
                    >
                      <FiExternalLink className="w-4 h-4" />
                      View All Projects
                    </Link>
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
                  <FiTrendingUp className="w-6 h-6 text-green-600" />
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
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                  <FiUsers className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.repeatCustomers}
                </div>
                <div className="text-sm text-gray-600">Repeat Customers</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-2">
                  <FiClock className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completionRate}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-2">
                  <FiCheckCircle className="w-6 h-6 text-red-600" />
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
                {
                  id: "reviews",
                  label: "Reviews",
                  count: stats?.totalReviews || 0,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-green-600 text-green-700"
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
                    {projects.slice(0, 6).map((project) => (
                      <div
                        key={project.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-700">
                            ${project.price}
                          </span>
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm">
                              {project.rating || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No projects available yet.</p>
                  </div>
                )}

                {projects.length > 6 && (
                  <div className="text-center mt-8">
                    <Link
                      href={`/creators/${creatorId}/projects`}
                      className="px-6 py-3 border border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      View All {projects.length} Projects
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-8">
                {creator.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {creator.bio}
                    </p>
                  </div>
                )}

                {creator.skills && creator.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {creator.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
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
                        {creator.workExperience.map((exp) => (
                          <div
                            key={exp.id}
                            className="border-l-2 border-green-200 pl-4"
                          >
                            <h4 className="font-medium text-gray-900">
                              {exp.title}
                            </h4>
                            <p className="text-indigo-600">{exp.company}</p>
                            <p className="text-sm text-gray-600">
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

                {creator.education && creator.education.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Education
                    </h3>
                    <div className="space-y-4">
                      {creator.education.map((edu) => (
                        <div
                          key={edu.id}
                          className="border-l-2 border-green-200 pl-4"
                        >
                          <h4 className="font-medium text-gray-900">
                            {edu.degree}
                          </h4>
                          <p className="text-green-600">{edu.institution}</p>
                          {edu.field && (
                            <p className="text-gray-600">{edu.field}</p>
                          )}
                          <p className="text-sm text-gray-600">
                            {edu.startDate} -{" "}
                            {edu.current ? "Present" : edu.endDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-12">
                <p className="text-gray-600">Reviews feature coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
