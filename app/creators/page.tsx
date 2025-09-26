/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { userService } from "@/lib/services/userService";
import { UserProfile } from "@/types/messaging";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiMapPin,
  FiUser,
  FiMessageCircle,
  FiExternalLink,
  FiGithub,
  FiLinkedin,
  FiGlobe,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function CreatorsPage() {
  const [user, loading] = useAuthState(auth);
  const [creators, setCreators] = useState<UserProfile[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    rating: 0,
    location: "",
    sortBy: "rating" as "rating" | "projects" | "newest",
  });
  const router = useRouter();

  const skillOptions = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Machine Learning",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Business Analysis",
    "Marketing",
    "Finance",
    "Engineering",
    "Mathematics",
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetchCreators();
    }
  }, [user, loading, router]);

  useEffect(() => {
    applyFilters();
  }, [creators, searchQuery, filters]);

  const fetchCreators = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching creators...");

      // First, let's try to get all users to see if there are any users at all
      const { creators: fetchedCreators } = await userService.getCreators(50);
      console.log("Fetched creators:", fetchedCreators.length, fetchedCreators);

      // If no creators found, let's check if there are any users at all
      if (fetchedCreators.length === 0) {
        console.log("No creators found. This might be because:");
        console.log("1. No users have role='creator'");
        console.log("2. No users exist in the database");
        console.log("3. There's an issue with the query");
      }

      setCreators(fetchedCreators);
    } catch (error) {
      console.error("Error fetching creators:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    console.log("Applying filters to creators:", creators.length);
    let filtered = [...creators];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (creator) =>
          creator.fullName.toLowerCase().includes(query) ||
          creator.bio?.toLowerCase().includes(query) ||
          creator.skills?.some((skill) => skill.toLowerCase().includes(query))
      );
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter((creator) =>
        creator.skills?.some((skill) =>
          filters.skills.some((filterSkill) =>
            skill.toLowerCase().includes(filterSkill.toLowerCase())
          )
        )
      );
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(
        (creator) => (creator.rating || 0) >= filters.rating
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((creator) =>
        creator.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "projects":
        filtered.sort((a, b) => (b.projectCount || 0) - (a.projectCount || 0));
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
        );
        break;
    }

    console.log("Filtered creators result:", filtered.length, filtered);
    setFilteredCreators(filtered);
  };

  const resetFilters = () => {
    setFilters({
      skills: [],
      rating: 0,
      location: "",
      sortBy: "rating",
    });
    setSearchQuery("");
  };

  const toggleSkillFilter = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const createTestCreator = async () => {
    if (!user) return;

    try {
      console.log("Creating test creator...");
      await userService.updateUserProfile(user.uid, {
        role: "creator",
        fullName: user.displayName || "Test Creator",
        bio: "I'm a test creator for demonstration purposes.",
        skills: ["JavaScript", "React", "Node.js"],
        location: "Test City",
        rating: 4.5,
        reviewCount: 10,
        projectCount: 5,
      });
      console.log("Test creator created successfully!");
      fetchCreators(); // Refresh the list
    } catch (error) {
      console.error("Error creating test creator:", error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading creators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Discover Creators
              </h1>
              <p className="mt-2 text-gray-600">
                Connect with talented creators and explore their amazing
                projects
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">
                {filteredCreators.length} creators found
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-green-700 hover:text-green-800"
                >
                  Reset
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search creators..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus-green"
                  />
                </div>
              </div>

              {/* Skills Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {skillOptions.map((skill) => (
                    <label key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.skills.includes(skill)}
                        onChange={() => toggleSkillFilter(skill)}
                        className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {skill}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      rating: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus-green"
                >
                  <option value="0">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.8">4.8+ Stars</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Enter location..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus-green"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-green-50 mb-4 sm:mb-0"
              >
                <FiFilter className="w-4 h-4" />
                Filters
              </button>

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as any,
                    }))
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 focus-green"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="projects">Most Projects</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Creators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
              {filteredCreators.map((creator) => (
                <CreatorCard key={creator.uid} creator={creator} />
              ))}
            </div>

            {filteredCreators.length === 0 && (
              <div className="text-center py-12">
                <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No creators found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms.
                </p>
                {!!user && (
                  <button
                    onClick={createTestCreator}
                    className="px-4 py-2 btn-primary"
                  >
                    Create Test Creator (Debug)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatorCard({ creator }: { creator: UserProfile }) {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const handleMessageClick = () => {
    if (!user) return; // type guard for TS
    if (creator.uid === user.uid) {
      alert("You cannot message yourself!");
      return;
    }
    router.push(`/messages?user=${creator.uid}`);
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 h-full flex flex-col">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Image
            src={creator.avatar || "/images/default-avatar.svg"}
            alt={creator.fullName}
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
          {creator.isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link
            href={`/creators/${creator.uid}`}
            className="text-lg font-semibold text-gray-900 hover:text-green-700 transition-colors"
          >
            {creator.fullName}
          </Link>

          {creator.location && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <FiMapPin className="w-3 h-3" />
              {creator.location}
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            {creator.rating && (
              <div className="flex items-center gap-1">
                <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">
                  {creator.rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({creator.reviewCount || 0})
                </span>
              </div>
            )}

            <span className="text-sm text-gray-500">
              {creator.projectCount || 0} projects
            </span>
          </div>
        </div>
      </div>

      {creator.bio && (
        <p className="text-gray-600 text-sm mt-3 line-clamp-2 min-h-[40px]">{creator.bio}</p>
      )}

      {creator.skills && creator.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {creator.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {creator.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{creator.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="mt-auto">
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {creator.website && (
              <a
                href={creator.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiGlobe className="w-4 h-4" />
              </a>
            )}
            {creator.github && (
              <a
                href={creator.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiGithub className="w-4 h-4" />
              </a>
            )}
            {creator.linkedin && (
              <a
                href={creator.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiLinkedin className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/creators/${creator.uid}`}
              className="px-5 py-3 text-sm border border-green-200 text-green-700 rounded-custom hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              <FiExternalLink className="w-4 h-4" />
              View
            </Link>
            {!!user && creator.uid !== user.uid && (
              <button
                onClick={handleMessageClick}
                className="px-5 py-3 text-sm btn-primary flex items-center gap-2"
              >
                <FiMessageCircle className="w-4 h-4" />
                Message
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
