/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { projectService } from "@/lib/database";
import ProjectCard from "@/components/common/ProjectCard";
import { HiArrowRight, HiSparkles } from "react-icons/hi";

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

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ALL projects, no filter
      const fetchedProjects = await projectService.getProjects({});

      // Format timestamps
      const formattedProjects = fetchedProjects.map((project: any) => ({
        ...project,
        createdAt:
          project.createdAt?.toDate?.()?.toISOString() || project.createdAt,
        thumbnailUrl: project.thumbnailUrl || "/images/project-placeholder.jpg",
      }));

      setProjects(formattedProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Academic Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Loading academic projects...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            <HiSparkles className="w-4 h-4" />
            All Projects
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Academic Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse all available academic projects from our database.
          </p>
          {projects.length > 0 && (
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {projects.length}
                </div>
                <div className="text-sm text-gray-500">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {projects.reduce(
                    (total, project) => total + (project.totalSales || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-gray-500">Total Sales</div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchProjects}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewMode="grid"
                />
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors font-medium"
              >
                View All Projects
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          !error && (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
                <HiSparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Projects Available
                </h3>
                <p className="text-gray-600 mb-6">
                  There are no projects at the moment. Check back soon!
                </p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Browse All Projects
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
