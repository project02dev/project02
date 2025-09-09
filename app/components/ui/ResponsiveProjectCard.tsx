"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FiHeart, 
  FiEye, 
  FiDownload, 
  FiStar, 
  FiUser,
  FiCalendar,
  FiTag,
  FiMoreVertical
} from "react-icons/fi";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    currency: string;
    category: string;
    tags: string[];
    creatorName: string;
    creatorId: string;
    createdAt: Date;
    likes: number;
    views: number;
    downloads: number;
    rating?: number;
    reviewCount?: number;
  };
  variant?: "grid" | "list";
  showCreator?: boolean;
  showStats?: boolean;
  className?: string;
}

export default function ResponsiveProjectCard({
  project,
  variant = "grid",
  showCreator = true,
  showStats = true,
  className = "",
}: ProjectCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (variant === "list") {
    return (
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 ${className}`}>
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
            <Link href={`/project/${project.id}`}>
              {!imageError ? (
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none flex items-center justify-center">
                  <FiTag className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </Link>
            
            {/* Price Badge */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-gray-900">
              {formatPrice(project.price, project.currency)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/project/${project.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                  </Link>
                  <button className="p-1 text-gray-400 hover:text-gray-600 ml-2">
                    <FiMoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {project.category}
                  </span>
                  {project.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {showCreator && (
                  <Link href={`/creator/${project.creatorId}`} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600">
                    <FiUser className="w-4 h-4" />
                    <span>{project.creatorName}</span>
                  </Link>
                )}

                {showStats && (
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FiEye className="w-3 h-3" />
                      <span>{formatNumber(project.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiHeart className="w-3 h-3" />
                      <span>{formatNumber(project.likes)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiDownload className="w-3 h-3" />
                      <span>{formatNumber(project.downloads)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group ${className}`}>
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Link href={`/project/${project.id}`}>
          {!imageError ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <FiTag className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </Link>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isLiked 
                  ? "bg-red-500 text-white" 
                  : "bg-white/90 text-gray-700 hover:bg-white"
              }`}
            >
              <FiHeart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <Link
              href={`/project/${project.id}`}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-all duration-200"
            >
              <FiEye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
          {formatPrice(project.price, project.currency)}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/project/${project.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
            {project.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="space-y-3">
          {/* Creator */}
          {showCreator && (
            <Link href={`/creator/${project.creatorId}`} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
              <FiUser className="w-4 h-4" />
              <span className="font-medium">{project.creatorName}</span>
            </Link>
          )}

          {/* Stats */}
          {showStats && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <FiEye className="w-3 h-3" />
                  <span>{formatNumber(project.views)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiHeart className="w-3 h-3" />
                  <span>{formatNumber(project.likes)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiDownload className="w-3 h-3" />
                  <span>{formatNumber(project.downloads)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-400">
                <FiCalendar className="w-3 h-3" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>
          )}

          {/* Rating */}
          {project.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(project.rating!)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {project.rating.toFixed(1)} ({project.reviewCount || 0})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
