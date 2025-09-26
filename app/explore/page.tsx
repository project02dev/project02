/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { projectService } from "@/lib/database";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/common/ProjectCard";
import ClientOnly from "@/components/common/ClientOnly";
import { FiSearch, FiFilter, FiGrid, FiList } from "react-icons/fi";

interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  department: string;
  creatorName: string;
  creatorId: string;
  rating: number;
  totalSales: number;
  tags: string[];
  thumbnailUrl?: string;
  previewUrl?: string;
  createdAt: string;
  featured: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface FilterState {
  [x: string]: any;
  department: string;
  priceRange: [number, number];
  difficulty: string;
  rating: number;
  sortBy: string;
  featured: boolean;
}

export default function ExplorePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    department: "",
    priceRange: [0, 500],
    difficulty: "",
    rating: 0,
    sortBy: "newest",
    featured: false,
  });

  const departments = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Psychology",
    "Economics",
    "Literature",
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, searchQuery, filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      // Build filters for the query
      const queryFilters: any = {};

      if (filters.department && filters.department !== "all") {
        queryFilters.department = filters.department;
      }

      if (filters.difficulty && filters.difficulty !== "all") {
        queryFilters.difficulty = filters.difficulty;
      }

      if (filters.featured) {
        queryFilters.featured = true;
      }

      // Set sorting - map frontend sort options to backend field names
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "newest":
            queryFilters.sortBy = "createdAt";
            queryFilters.sortOrder = "desc";
            break;
          case "oldest":
            queryFilters.sortBy = "createdAt";
            queryFilters.sortOrder = "asc";
            break;
          case "price-low":
            queryFilters.sortBy = "price";
            queryFilters.sortOrder = "asc";
            break;
          case "price-high":
            queryFilters.sortBy = "price";
            queryFilters.sortOrder = "desc";
            break;
          case "rating":
            queryFilters.sortBy = "rating";
            queryFilters.sortOrder = "desc";
            break;
          case "popular":
            queryFilters.sortBy = "totalSales";
            queryFilters.sortOrder = "desc";
            break;
          default:
            queryFilters.sortBy = "createdAt";
            queryFilters.sortOrder = "desc";
        }
      }

      // Fetch projects from Firebase
      const fetchedProjects = await projectService.getProjects(queryFilters);

      // Convert Firestore timestamps to strings
      const formattedProjects = fetchedProjects.map((project: any) => ({
        ...project,
        createdAt:
          project.createdAt?.toDate?.()?.toISOString() || project.createdAt,
        updatedAt:
          project.updatedAt?.toDate?.()?.toISOString() || project.updatedAt,
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Department filter
    if (filters.department) {
      filtered = filtered.filter(
        (project) => project.department === filters.department
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (project) =>
        project.price >= filters.priceRange[0] &&
        project.price <= filters.priceRange[1]
    );

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(
        (project) => project.difficulty === filters.difficulty
      );
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((project) => project.rating >= filters.rating);
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.totalSales - a.totalSales);
        break;
    }

    setFilteredProjects(filtered);
  };

  const resetFilters = () => {
    setFilters({
      department: "",
      priceRange: [0, 500],
      difficulty: "",
      rating: 0,
      sortBy: "newest",
      featured: false,
    });
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
            <p>Loading projects...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Explore Academic Projects
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover high-quality academic projects from verified creators.
                Find the perfect project for your studies or research.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Results */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div
              className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}
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

                {/* Department Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) =>
                      setFilters({ ...filters, department: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${filters.priceRange[0]} - $
                    {filters.priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priceRange: [
                          filters.priceRange[0],
                          parseInt(e.target.value),
                        ],
                      })
                    }
                    className="w-full"
                  />
                </div>

                {/* Difficulty */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) =>
                      setFilters({ ...filters, difficulty: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        rating: parseFloat(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  >
                    <option value="0">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                  <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                  >
                                    <FiFilter className="w-4 h-4 text-green-700" />
                                    Filters
                                  </button>
                                  <p className="text-gray-600">
                                    {filteredProjects.length} projects found
                                  </p>
                                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value })
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-md">
                                      <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 ${
                                          viewMode === "grid"
                                            ? "primary-green text-white"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                        aria-label="Grid view"
                                        aria-pressed={viewMode === "grid"}
                                      >
                                        <FiGrid className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 ${
                                          viewMode === "list"
                                            ? "primary-green text-white"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                        aria-label="List view"
                                        aria-pressed={viewMode === "list"}
                                      >
                                        <FiList className="w-4 h-4" />
                                      </button>
                                    </div>
                </div>
              </div>

              {/* Projects Grid/List */}
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">
                    No projects found
                  </p>
                  <button
                    onClick={resetFilters}
                    className="text-green-700 hover:text-green-800"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
