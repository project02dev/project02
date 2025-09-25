/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user] = useAuthState(auth);

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProject();
    // eslint-disable-next-line
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, "projects", id as string);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        setError("Project not found.");
        setProject(null);
      } else {
        setProject({ id: snap.id, ...snap.data() });
      }
    } catch (err) {
      setError("Failed to load project.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setProject((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const docRef = doc(db, "projects", id as string);
      await updateDoc(docRef, {
        title: project.title,
        description: project.description,
        price: Number(project.price),
        department: project.department,
        difficulty: project.difficulty,
        tags: project.tags?.split(",").map((t: string) => t.trim()),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p>Loading project...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-red-600">
            {error || "Project not found."}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Only allow creator to edit
  if (user?.uid !== project.creatorId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-red-600">
            You do not have permission to edit this project.
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
        <div className="container mx-auto px-4 py-8 max-w-xl">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            Edit Project
          </h1>
          <form className="space-y-6" onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={project.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={project.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={project.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min={0}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={project.department}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={project.difficulty}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={
                    Array.isArray(project.tags)
                      ? project.tags.join(", ")
                      : project.tags || ""
                  }
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                onClick={() => router.back()}
              >
                Cancel
              </button>
            </div>
            {success && (
              <div className="text-green-600 text-sm mt-2">
                Project updated successfully!
              </div>
            )}
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
