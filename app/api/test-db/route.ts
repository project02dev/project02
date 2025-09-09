/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { projectService, userService } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Test database connection and operations
    const testResults = {
      timestamp: new Date().toISOString(),
      tests: [] as any[],
    };

    // Test 1: Fetch projects
    try {
      const projects = await projectService.getProjects({ limit: 5 });
      testResults.tests.push({
        name: "Fetch Projects",
        status: "success",
        result: `Found ${projects.length} projects`,
        data: projects.map((p) => ({ id: p.id })),
      });
    } catch (error) {
      testResults.tests.push({
        name: "Fetch Projects",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Test 2: Create a sample project (if none exist)
    try {
      const existingProjects = await projectService.getProjects({ limit: 1 });

      if (existingProjects.length === 0) {
        const sampleProject = {
          title: "Sample ML Project",
          description: "A sample machine learning project for testing",
          department: "Computer Science",
          price: 49.99,
          difficulty: "intermediate" as const,
          tags: ["Python", "Machine Learning", "Test"],
          category: "ready-made" as const,
          creatorId: "test-creator",
          creatorName: "Test Creator",
          status: "active",
          featured: false,
          deliverables: ["Source code", "Documentation"],
          githubRepo: "",
          previewDescription: "Sample project for testing",
          requirements: "Basic Python knowledge",
          estimatedTime: "2-3 hours",
          thumbnailUrl: "/images/projects/ml-stock.svg",
          projectFiles: [],
        };

        const result = await projectService.createProject(sampleProject);
        testResults.tests.push({
          name: "Create Sample Project",
          status: "success",
          result: `Created project with ID: ${result.id}`,
        });
      } else {
        testResults.tests.push({
          name: "Create Sample Project",
          status: "skipped",
          result: "Projects already exist",
        });
      }
    } catch (error) {
      testResults.tests.push({
        name: "Create Sample Project",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database tests completed",
      results: testResults,
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
