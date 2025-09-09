/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { projectService, userService } from "@/lib/database";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import {
  FiGithub,
  FiDollarSign,
  FiTag,
  FiFileText,
  FiX,
  FiLink,
} from "react-icons/fi";

interface ProjectFormData {
  title: string;
  description: string;
  department: string;
  price: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  githubRepo: string;
  previewDescription: string;
  requirements: string;
  deliverables: string[];
  estimatedTime: string;
  category: "ready-made" | "custom";
  thumbnailUrl: string;
  projectFiles: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
}

export default function CreateProjectPage() {
  const [user, loading, error] = useAuthState(auth);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    department: "",
    price: 0,
    difficulty: "beginner",
    tags: [],
    githubRepo: "",
    previewDescription: "",
    requirements: "",
    deliverables: [],
    estimatedTime: "",
    category: "ready-made",
    thumbnailUrl: "",
    projectFiles: [],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [currentDeliverable, setCurrentDeliverable] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const router = useRouter();

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
    if (user) {
      checkUserRole();
    }
  }, [user]);

  const checkUserRole = async () => {
    if (!user) return;

    try {
      const userData = await userService.getUser(user.uid);

      if (userData) {
        setUserRole(userData.role || "student");

        // Allow access for creators or if no role is set (new users)
        if (userData.role && userData.role !== "creator") {
          router.push("/dashboard");
        }
      } else {
        // New user - create profile and allow access
        await userService.createUser(user.uid, {
          fullName: user.displayName || "",
          email: user.email || "",
          role: "student",
          verified: false,
        });
        setUserRole("student");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      // On error, allow access
      setUserRole("student");
    }
  };

  const connectGitHub = async () => {
    try {
      setLoadingRepos(true);
      // TODO: Implement GitHub OAuth integration
      // For now, using mock data
      const mockRepos = [
        {
          id: 1,
          name: "ml-stock-prediction",
          full_name: "user/ml-stock-prediction",
          description: "Machine learning model for stock price prediction",
          html_url: "https://github.com/user/ml-stock-prediction",
          language: "Python",
        },
        {
          id: 2,
          name: "react-ecommerce",
          full_name: "user/react-ecommerce",
          description: "Full-stack e-commerce application",
          html_url: "https://github.com/user/react-ecommerce",
          language: "JavaScript",
        },
        {
          id: 3,
          name: "business-plan-template",
          full_name: "user/business-plan-template",
          description: "Comprehensive business plan template",
          html_url: "https://github.com/user/business-plan-template",
          language: null,
        },
      ];

      setGithubRepos(mockRepos);
    } catch (error) {
      console.error("Error connecting to GitHub:", error);
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addDeliverable = () => {
    if (
      currentDeliverable.trim() &&
      !formData.deliverables.includes(currentDeliverable.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        deliverables: [...prev.deliverables, currentDeliverable.trim()],
      }));
      setCurrentDeliverable("");
    }
  };

  const removeDeliverable = (deliverableToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter(
        (item) => item !== deliverableToRemove
      ),
    }));
  };

  const handleThumbnailUpload = (
    files: Array<{ name: string; url: string; size: number; type: string }>
  ) => {
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: files[0].url,
      }));
    }
  };

  const handleProjectFilesUpload = (
    files: Array<{ name: string; url: string; size: number; type: string }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      projectFiles: [...prev.projectFiles, ...files],
    }));
  };

  const removeProjectFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projectFiles: prev.projectFiles.filter((_, i) => i !== index),
    }));
  };

  const selectGitHubRepo = (repo: any) => {
    setFormData((prev) => ({
      ...prev,
      githubRepo: repo.html_url,
      title:
        prev.title ||
        repo.name
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase()),
      description: prev.description || repo.description || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      setIsSubmitting(true);

      // Prepare project data
      const projectData = {
        title: formData.title,
        description: formData.description,
        department: formData.department,
        price: formData.price,
        difficulty: formData.difficulty,
        tags: formData.tags,
        githubRepo: formData.githubRepo,
        previewDescription: formData.previewDescription,
        requirements: formData.requirements,
        deliverables: formData.deliverables,
        estimatedTime: formData.estimatedTime,
        category: formData.category,
        creatorId: user.uid,
        creatorName:
          user.displayName || user.email?.split("@")[0] || "Anonymous",
        status: "active", // Set to active for demo, normally would be "pending_review"
        featured: false,
        thumbnailUrl: formData.thumbnailUrl,
        projectFiles: formData.projectFiles,
      };

      // Save project to Firebase
      const result = await projectService.createProject(projectData);

      if (result.success) {
        // Update user role to creator if not already
        if (userRole !== "creator") {
          await userService.updateUser(user.uid, { role: "creator" });
        }

        alert(
          "Project created successfully! It's now live on the marketplace."
        );
        router.push("/dashboard");
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    router.push("/login");
    return null;
  }

  if (userRole && userRole !== "creator") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Become a Creator
          </h2>
          <p className="text-gray-600 mb-6">
            To create and sell projects, you need to upgrade to a creator
            account. This will give you access to project creation tools and
            earnings dashboard.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                // TODO: Implement role upgrade
                alert(
                  "Creator upgrade feature coming soon! For now, you can access the creation form."
                );
                setUserRole("creator");
              }}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Upgrade to Creator
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create New Project
              </h1>
              <p className="text-gray-600">
                Share your knowledge and earn by creating academic projects for
                students.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Project Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Project Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.category === "ready-made"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => handleInputChange("category", "ready-made")}
                  >
                    <div className="flex items-center mb-2">
                      <FiFileText className="w-5 h-5 mr-2 text-indigo-600" />
                      <h3 className="font-semibold">Ready-Made Project</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Complete project that students can purchase and download
                      immediately
                    </p>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.category === "custom"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => handleInputChange("category", "custom")}
                  >
                    <div className="flex items-center mb-2">
                      <FiTag className="w-5 h-5 mr-2 text-indigo-600" />
                      <h3 className="font-semibold">Custom Project Service</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Offer to create custom projects based on student
                      requirements
                    </p>
                  </div>
                </div>
              </div>

              {/* GitHub Integration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  GitHub Repository (Optional)
                </label>
                <div className="space-y-4">
                  {!githubRepos.length ? (
                    <button
                      type="button"
                      onClick={connectGitHub}
                      disabled={loadingRepos}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FiGithub className="w-5 h-5" />
                      {loadingRepos ? "Loading..." : "Connect GitHub"}
                    </button>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-3">
                        Select a repository to import:
                      </p>
                      <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                        {githubRepos.map((repo) => (
                          <div
                            key={repo.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              formData.githubRepo === repo.html_url
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            onClick={() => selectGitHubRepo(repo)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{repo.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {repo.description}
                                </p>
                              </div>
                              {repo.language && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {repo.language}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.githubRepo && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <FiLink className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        Connected: {formData.githubRepo}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe your project in detail..."
                />
              </div>

              {/* Pricing and Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD) *
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", parseFloat(e.target.value))
                      }
                      className="w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    required
                    value={formData.difficulty}
                    onChange={(e) =>
                      handleInputChange("difficulty", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedTime}
                    onChange={(e) =>
                      handleInputChange("estimatedTime", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., 2-3 days"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Thumbnail
                  </label>
                  <FileUpload
                    projectId={user?.uid || "temp"}
                    fileType="thumbnail"
                    accept="image/*"
                    maxSizeMB={5}
                    multiple={false}
                    onUploadComplete={handleThumbnailUpload}
                    onUploadError={(error) => alert(error)}
                  />
                  {formData.thumbnailUrl && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 mb-2">
                        Thumbnail uploaded successfully!
                      </p>
                      <img
                        src={formData.thumbnailUrl}
                        alt="Project thumbnail"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {formData.category === "ready-made" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Files *
                    </label>
                    <FileUpload
                      projectId={user?.uid || "temp"}
                      fileType="project"
                      maxSizeMB={50}
                      multiple={true}
                      onUploadComplete={handleProjectFilesUpload}
                      onUploadError={(error) => alert(error)}
                    />
                    {formData.projectFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Uploaded files ({formData.projectFiles.length}):
                        </p>
                        <div className="space-y-2">
                          {formData.projectFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <FiFileText className="w-4 h-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                                >
                                  View
                                </a>
                                <button
                                  onClick={() => removeProjectFile(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview Description
                </label>
                <textarea
                  rows={3}
                  value={formData.previewDescription}
                  onChange={(e) =>
                    handleInputChange("previewDescription", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Brief description that will be shown in the preview..."
                />
              </div>

              {formData.category === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements & Process
                  </label>
                  <textarea
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) =>
                      handleInputChange("requirements", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Describe what you need from the client and your process..."
                  />
                </div>
              )}

              {/* Deliverables */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What&apos;s Included / Deliverables
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentDeliverable}
                    onChange={(e) => setCurrentDeliverable(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addDeliverable())
                    }
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add a deliverable"
                  />
                  <button
                    type="button"
                    onClick={addDeliverable}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.deliverables.map((deliverable, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-800">• {deliverable}</span>
                      <button
                        type="button"
                        onClick={() => removeDeliverable(deliverable)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
