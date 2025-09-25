/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { projectService } from "@/lib/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase/config";
import Link from "next/link";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiHeart,
  FiBarChart2,
  FiUsers,
  FiStar,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  views?: number;
  likes?: number;
  likedBy?: string[];
  analytics?: {
    [date: string]: {
      views: number;
      likes: number;
    };
  };
}

interface Rating {
  id: string;
  star: number;
  rated_by: string;
  review?: string;
  date?: { seconds: number };
  user_name?: string;
  user_email?: string;
}

const MyProjects = () => {
  const [user] = useAuthState(auth);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<{ [projectId: string]: Rating[] }>({});
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [loadingRatings, setLoadingRatings] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const fetched = await projectService.getProjects({
        creatorId: user?.uid,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      const projectsData = fetched.map((p: any) => ({
        ...p,
        createdAt: p.createdAt?.toDate?.()?.toISOString() || p.createdAt,
      }));
      setProjects(projectsData);
    } catch (err) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingsForProject = async (projectId: string) => {
    if (ratings[projectId]) return; // Already loaded

    setLoadingRatings(projectId);
    try {
      const ratingsQuery = query(
        collection(db, "ratings"),
        where("project_Id", "==", projectId)
      );
      const querySnapshot = await getDocs(ratingsQuery);

      const projectRatings: Rating[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projectRatings.push({
          id: doc.id,
          star: data.star || 0,
          rated_by: data.rated_by || "",
          review: data.review || "",
          date: data.date || undefined,
          user_name: data.user_name || "Anonymous",
          user_email: data.user_email || "",
        });
      });

      // Sort by date (newest first)
      projectRatings.sort(
        (a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0)
      );

      setRatings((prev) => ({
        ...prev,
        [projectId]: projectRatings,
      }));
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoadingRatings(null);
    }
  };

  const toggleProjectExpansion = async (projectId: string) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
      await fetchRatingsForProject(projectId);
    }
  };

  const getAverageRating = (projectId: string) => {
    const projectRatings = ratings[projectId] || [];
    if (projectRatings.length === 0) return 0;
    const total = projectRatings.reduce((sum, rating) => sum + rating.star, 0);
    return total / projectRatings.length;
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
      // Remove ratings from local state
      setRatings((prev) => {
        const newRatings = { ...prev };
        delete newRatings[id];
        return newRatings;
      });
    } catch (err) {
      console.error("Error deleting project:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">My Projects</h2>
      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p>Loading your projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven&apos;t posted any projects yet.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const projectRatings = ratings[project.id] || [];
            const averageRating = getAverageRating(project.id);
            const isExpanded = expandedProject === project.id;

            return (
              <div
                key={project.id}
                className="border rounded-lg overflow-hidden"
              >
                {/* Project Header */}
                <div className="bg-gray-50 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <Link
                        href={`/project/${project.id}`}
                        className="font-medium text-blue-600 hover:underline text-lg"
                      >
                        {project.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>
                          Created:{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiEye className="w-4 h-4" />
                          {project.views ?? 0} views
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiHeart className="w-4 h-4 text-pink-500" />
                          {project.likes ?? 0} likes
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-500" />
                          {averageRating > 0
                            ? averageRating.toFixed(1)
                            : "No"}{" "}
                          ratings ({projectRatings.length})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleProjectExpansion(project.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50"
                      >
                        <FiMessageSquare className="w-4 h-4" />
                        Reviews
                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      </button>

                      <div className="flex gap-1">
                        <Link
                          href={`/project/${project.id}/edit`}
                          className="p-2 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <FiEdit className="w-5 h-5 text-blue-600" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 rounded hover:bg-red-50"
                          title="Delete"
                          disabled={deletingId === project.id}
                        >
                          <FiTrash2 className="w-5 h-5 text-red-600" />
                        </button>
                        <Link
                          href={`/project/${project.id}/analytics`}
                          className="p-2 rounded hover:bg-purple-50"
                          title="Analytics"
                        >
                          <FiBarChart2 className="w-5 h-5 text-purple-600" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ratings & Reviews Section */}
                {isExpanded && (
                  <div className="p-4 bg-white">
                    {loadingRatings === project.id ? (
                      <div className="text-center py-4">
                        <div className="w-6 h-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">
                          Loading reviews...
                        </p>
                      </div>
                    ) : projectRatings.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No reviews yet for this project.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Rating Summary */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium mb-3">Rating Summary</h4>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="text-3xl font-bold">
                                {averageRating.toFixed(1)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-1 mb-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <FiStar
                                      key={i}
                                      className={`w-5 h-5 ${
                                        i < Math.floor(averageRating)
                                          ? "text-yellow-400 fill-current"
                                          : averageRating % 1 > 0.5 &&
                                            i === Math.floor(averageRating)
                                          ? "text-yellow-400 fill-current opacity-70"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {projectRatings.length} review
                                  {projectRatings.length !== 1 ? "s" : ""}
                                </div>
                              </div>
                            </div>

                            {/* Rating Distribution */}
                            <div className="space-y-1">
                              {[5, 4, 3, 2, 1].map((star) => {
                                const count = projectRatings.filter(
                                  (r) => r.star === star
                                ).length;
                                const percentage =
                                  projectRatings.length > 0
                                    ? (count / projectRatings.length) * 100
                                    : 0;
                                return (
                                  <div
                                    key={star}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <span className="w-4">{star}</span>
                                    <FiStar className="w-3 h-3 text-yellow-400" />
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-yellow-400 h-2 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className="w-8 text-xs text-gray-500">
                                      {count}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Recent Reviews Preview */}
                          <div>
                            <h4 className="font-medium mb-3">Recent Reviews</h4>
                            <div className="space-y-3">
                              {projectRatings.slice(0, 2).map((rating) => (
                                <div
                                  key={rating.id}
                                  className="border-l-4 border-blue-200 pl-3"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="flex items-center gap-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <FiStar
                                          key={i}
                                          className={`w-3 h-3 ${
                                            i < rating.star
                                              ? "text-yellow-400 fill-current"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm font-medium">
                                      {rating.user_name}
                                    </span>
                                  </div>
                                  {rating.review && (
                                    <p className="text-sm text-gray-700 line-clamp-2">
                                      {rating.review}
                                    </p>
                                  )}
                                  <div className="text-xs text-gray-500 mt-1">
                                    {rating.date?.seconds
                                      ? formatDate(rating.date.seconds)
                                      : "Unknown date"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* All Reviews */}
                        <div>
                          <h4 className="font-medium mb-3">All Reviews</h4>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {projectRatings.map((rating) => (
                              <div
                                key={rating.id}
                                className="border rounded-lg p-3"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                      {rating.user_name
                                        ?.charAt(0)
                                        .toUpperCase() || "U"}
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm">
                                        {rating.user_name}
                                      </div>
                                      {rating.user_email && (
                                        <div className="text-xs text-gray-500">
                                          {rating.user_email}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <FiStar
                                          key={i}
                                          className={`w-3 h-3 ${
                                            i < rating.star
                                              ? "text-yellow-400 fill-current"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {rating.date?.seconds
                                        ? formatDate(rating.date.seconds)
                                        : "Unknown date"}
                                    </div>
                                  </div>
                                </div>

                                {rating.review && (
                                  <p className="text-sm text-gray-700 mt-2">
                                    {rating.review}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
