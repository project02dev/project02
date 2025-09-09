/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { userService } from "@/lib/services/userService";
import { UserProfile, CreatorStats } from "@/types/messaging";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import {
  FiEdit3,
  FiMapPin,
  FiCalendar,
  FiGlobe,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiStar,
  FiAward,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

export default function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "projects" | "activity">(
    "about"
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetchProfileData();
    }
  }, [user, loading, router]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch user profile
      const userProfile = await userService.getUserProfile(user.uid);
      if (userProfile) {
        setProfile(userProfile);

        // If user is a creator, fetch stats and projects
        if (userProfile.role === "creator") {
          const creatorStats = await userService.getCreatorStats(user.uid);
          setStats(creatorStats);

          const userProjects = await userService.getUserProjects(user.uid);
          setProjects(userProjects);
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile not found
          </h2>
          <p className="text-gray-600 mb-4">Unable to load your profile.</p>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col md:flex-row gap-6 flex-1">
              <div className="relative">
                <Image
                  src={profile.avatar || "/images/default-avatar.svg"}
                  alt={profile.fullName}
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
                {profile.isOnline && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.fullName}
                    </h1>
                    {profile.username && (
                      <p className="text-lg text-gray-600">
                        @{profile.username}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {profile.location && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <FiMapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-gray-600">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          Joined{" "}
                          {new Date(profile.joinedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {profile.rating && (
                        <div className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">
                            {profile.rating.toFixed(1)}
                          </span>
                          <span className="text-gray-600">
                            ({profile.reviewCount || 0} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-3 mt-4">
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                          <FiGlobe className="w-5 h-5" />
                        </a>
                      )}
                      {profile.github && (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                          <FiGithub className="w-5 h-5" />
                        </a>
                      )}
                      {profile.linkedin && (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                          <FiLinkedin className="w-5 h-5" />
                        </a>
                      )}
                      {profile.email && (
                        <a
                          href={`mailto:${profile.email}`}
                          className="text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                          <FiMail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 mt-6 md:mt-0">
                    <Link
                      href="/profile/edit"
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <FiEdit3 className="w-4 h-4" />
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section for Creators */}
      {profile.role === "creator" && stats && (
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
                  <FiTrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completionRate}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-2">
                  <FiMail className="w-6 h-6 text-red-600" />
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
                { id: "about", label: "About" },
                ...(profile.role === "creator"
                  ? [
                      {
                        id: "projects",
                        label: "Projects",
                        count: projects.length,
                      },
                    ]
                  : []),
                { id: "activity", label: "Activity" },
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
                  {(tab as any).count !== undefined && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                      {(tab as any).count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "about" && (
              <div className="space-y-8">
                {profile.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.workExperience &&
                  profile.workExperience.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Work Experience
                      </h3>
                      <div className="space-y-4">
                        {profile.workExperience.map((exp) => (
                          <div
                            key={exp.id}
                            className="border-l-2 border-indigo-200 pl-4"
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

                {profile.education && profile.education.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Education
                    </h3>
                    <div className="space-y-4">
                      {profile.education.map((edu) => (
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
                          {edu.gpa && (
                            <p className="text-sm text-gray-600">
                              GPA: {edu.gpa}
                            </p>
                          )}
                          {edu.description && (
                            <p className="text-gray-700 mt-2">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "projects" && profile.role === "creator" && (
              <div>
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
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
                          <span className="text-lg font-bold text-indigo-600">
                            ${project.price}
                          </span>
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm">
                              {project.rating || 0}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Link
                            href={`/project/${project.id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            View Project →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No projects created yet.</p>
                    <Link
                      href="/create-project"
                      className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Create Your First Project
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="text-center py-12">
                <p className="text-gray-600">Activity feed coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
