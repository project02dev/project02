/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { projectService, userService } from "@/lib/database";
import Header from "@/components/Header";

export default function TestPage() {
  const [user, loading] = useAuthState(auth);
  const [testResults, setTestResults] = useState<any>(null);
  const [storageResults, setStorageResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isRunningStorage, setIsRunningStorage] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const response = await fetch("/api/test-db");
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      setTestResults({
        success: false,
        error: "Failed to run tests",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runStorageTests = async () => {
    setIsRunningStorage(true);
    try {
      const response = await fetch("/api/test-storage");
      const data = await response.json();
      setStorageResults(data);
    } catch (error) {
      setStorageResults({
        success: false,
        error: "Failed to run storage tests",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsRunningStorage(false);
    }
  };

  const createSampleProject = async () => {
    if (!user) {
      alert("Please log in first");
      return;
    }

    try {
      const sampleProject = {
        title: `Test Project ${Date.now()}`,
        description: "This is a test project created from the test page",
        department: "Computer Science",
        price: 29.99,
        difficulty: "beginner" as const,
        tags: ["Test", "Sample", "Demo"],
        category: "ready-made" as const,
        creatorId: user.uid,
        creatorName:
          user.displayName || user.email?.split("@")[0] || "Test User",
        status: "active",
        featured: false,
        deliverables: ["Source code", "Documentation", "Test files"],
        githubRepo: "",
        previewDescription: "A sample project for testing the platform",
        requirements: "No special requirements",
        estimatedTime: "1 hour",
        thumbnailUrl: "/images/projects/ml-stock.svg",
        projectFiles: [],
      };

      const result = await projectService.createProject(sampleProject);

      if (result.success) {
        alert(`Project created successfully! ID: ${result.id}`);
        runTests(); // Refresh test results
      } else {
        alert("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Platform Test Page
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Database Tests */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Database Tests</h2>
              <button
                onClick={runTests}
                disabled={isRunning}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
              >
                {isRunning ? "Running Tests..." : "Run Database Tests"}
              </button>

              {testResults && (
                <div className="space-y-4">
                  <div
                    className={`p-3 rounded ${
                      testResults.success
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Status: {testResults.success ? "Success" : "Failed"}
                  </div>

                  {testResults.results?.tests && (
                    <div className="space-y-2">
                      {testResults.results.tests.map(
                        (test: any, index: number) => (
                          <div key={index} className="border rounded p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{test.name}</span>
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  test.status === "success"
                                    ? "bg-green-100 text-green-800"
                                    : test.status === "error"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {test.status}
                              </span>
                            </div>
                            {test.result && (
                              <p className="text-sm text-gray-600 mt-1">
                                {test.result}
                              </p>
                            )}
                            {test.error && (
                              <p className="text-sm text-red-600 mt-1">
                                {test.error}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Storage Tests */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Storage Tests</h2>
              <button
                onClick={runStorageTests}
                disabled={isRunningStorage}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 mb-4"
              >
                {isRunningStorage
                  ? "Testing Storage..."
                  : "Test Tebi Cloud Storage"}
              </button>

              {storageResults && (
                <div className="space-y-4">
                  <div
                    className={`p-3 rounded ${
                      storageResults.success
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Status: {storageResults.success ? "Success" : "Failed"}
                  </div>

                  {storageResults.results?.tests && (
                    <div className="space-y-2">
                      {storageResults.results.tests.map(
                        (test: any, index: number) => (
                          <div key={index} className="border rounded p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{test.name}</span>
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  test.status === "success"
                                    ? "bg-green-100 text-green-800"
                                    : test.status === "error"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {test.status}
                              </span>
                            </div>
                            {test.result && (
                              <p className="text-sm text-gray-600 mt-1">
                                {test.result}
                              </p>
                            )}
                            {test.error && (
                              <p className="text-sm text-red-600 mt-1">
                                {test.error}
                              </p>
                            )}
                            {test.url && (
                              <a
                                href={test.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-800 mt-1 block"
                              >
                                View uploaded file
                              </a>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">User Actions</h2>

              {user ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-100 text-green-800 rounded">
                    Logged in as: {user.displayName || user.email}
                  </div>

                  <button
                    onClick={createSampleProject}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Create Sample Project
                  </button>

                  <div className="space-y-2">
                    <a
                      href="/create-project"
                      className="block w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-center"
                    >
                      Go to Create Project
                    </a>

                    <a
                      href="/explore"
                      className="block w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
                    >
                      Go to Explore Projects
                    </a>

                    <a
                      href="/dashboard"
                      className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
                    >
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              ) : loading ? (
                <div className="p-3 bg-yellow-100 text-yellow-800 rounded">
                  Loading user data...
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-red-100 text-red-800 rounded">
                    Not logged in
                  </div>

                  <a
                    href="/login"
                    className="block w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-center"
                  >
                    Go to Login
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Platform Status */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Platform Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm font-medium">Authentication</div>
                <div className="text-xs text-gray-500">Firebase Auth</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm font-medium">Database</div>
                <div className="text-xs text-gray-500">Firestore</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm font-medium">File Storage</div>
                <div className="text-xs text-gray-500">Tebi Cloud</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">⚠️</div>
                <div className="text-sm font-medium">Payments</div>
                <div className="text-xs text-gray-500">Demo Mode</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
