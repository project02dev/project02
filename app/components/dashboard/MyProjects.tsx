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
} from "react-icons/fi";
import { doc, deleteDoc } from "firebase/firestore";

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

const MyProjects = () => {
  const [user] = useAuthState(auth);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Fetch projects where creatorId == user.uid
      const fetched = await projectService.getProjects({
        creatorId: user?.uid,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setProjects(
        fetched.map((p: any) => ({
          ...p,
          createdAt: p.createdAt?.toDate?.()?.toISOString() || p.createdAt,
        }))
      );
    } catch (err) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      // Optionally show error
    } finally {
      setDeletingId(null);
    }
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
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left font-semibold">Title</th>
                <th className="p-2 text-left font-semibold">Created</th>
                <th className="p-2 text-center font-semibold">Views</th>
                <th className="p-2 text-center font-semibold">Likes</th>
                <th className="p-2 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b last:border-b-0">
                  <td className="p-2">
                    <Link
                      href={`/project/${project.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="p-2">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-center">
                    <span className="inline-flex items-center gap-1">
                      <FiEye className="w-4 h-4 text-gray-500" />
                      {project.views ?? 0}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <span className="inline-flex items-center gap-1">
                      <FiHeart className="w-4 h-4 text-pink-500" />
                      {project.likes ?? 0}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center gap-2">
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
                      <button
                        className="p-2 rounded hover:bg-gray-50"
                        title="View Likes"
                        onClick={() => {
                          // Show modal with likedBy users (implement as needed)
                          alert(
                            project.likedBy && project.likedBy.length
                              ? `Liked by:\n${project.likedBy.join("\n")}`
                              : "No likes yet."
                          );
                        }}
                      >
                        <FiUsers className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
