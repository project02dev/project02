"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CompactLikeButton } from "./LikeButton";
import {
  FiStar,
  FiUser,
  FiEye,
  FiShoppingBag,
  FiFileText,
} from "react-icons/fi";

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
  totalLikes?: number;
  tags: string[];
  thumbnailUrl?: string;
  previewUrl?: string;
  createdAt: string;
  featured: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface ProjectCardProps {
  project: Project;
  viewMode: "grid" | "list";
}

export default function ProjectCard({ project, viewMode }: ProjectCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnail */}
            <div className="md:w-48 md:h-32 w-full h-48 relative rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              {project.thumbnailUrl ? (
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FiFileText className="w-8 h-8" />
                </div>
              )}
              {project.featured && (
                <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Featured
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600">
                      <Link href={`/project/${project.id}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        project.difficulty
                      )}`}
                    >
                      {project.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <FiUser className="w-4 h-4" />
                      <span>{project.creatorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {project.department}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="md:text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {formatPrice(project.price)}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3 md:justify-end">
                    <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{project.rating}</span>
                    <span>({project.totalSales} sales)</span>
                  </div>

                  <div className="flex gap-2 md:justify-end">
                    {project.previewUrl && (
                      <Link
                        href={project.previewUrl}
                        target="_blank"
                        className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                      >
                        <FiEye className="w-4 h-4" />
                        Preview
                      </Link>
                    )}
                    <Link
                      href={`/project/${project.id}`}
                      className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                    >
                      <FiShoppingBag className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-200">
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FiFileText className="w-12 h-12" />
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 left-3 bg-indigo-600 text-white px-2 py-1 rounded text-xs font-medium">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              project.difficulty
            )}`}
          >
            {project.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-indigo-600">
            <Link href={`/project/${project.id}`} className="line-clamp-2">
              {project.title}
            </Link>
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {project.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <FiUser className="w-4 h-4" />
          <span>{project.creatorName}</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
            {project.department}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags?.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {(project.tags?.length ?? 0) > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              +{(project.tags?.length ?? 0) - 2}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">{project.rating}</span>
              <span>({project.totalSales})</span>
            </div>
            <CompactLikeButton
              projectId={project.id}
              initialCount={project.totalLikes || 0}
            />
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatPrice(project.price)}
          </div>
        </div>

        <div className="flex gap-2">
          {project.previewUrl && (
            <Link
              href={project.previewUrl}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
            >
              <FiEye className="w-4 h-4" />
              Preview
            </Link>
          )}
          <Link
            href={`/project/${project.id}`}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            <FiShoppingBag className="w-4 h-4" />
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
