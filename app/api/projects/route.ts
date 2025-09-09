/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build filters from query parameters
    const filters: any = {};

    if (searchParams.get("department")) {
      filters.department = searchParams.get("department");
    }

    if (searchParams.get("difficulty")) {
      filters.difficulty = searchParams.get("difficulty");
    }

    if (searchParams.get("featured")) {
      filters.featured = searchParams.get("featured") === "true";
    }

    if (searchParams.get("sortBy")) {
      filters.sortBy = searchParams.get("sortBy");
      filters.sortOrder = searchParams.get("sortOrder") || "desc";
    }

    if (searchParams.get("limit")) {
      filters.limit = parseInt(searchParams.get("limit") || "20");
    }

    const projects = await projectService.getProjects(filters);

    return NextResponse.json({
      success: true,
      projects,
      count: projects.length,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json();

    // Validate required fields
    if (!projectData.title || !projectData.description || !projectData.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await projectService.createProject(projectData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        projectId: result.id,
        message: "Project created successfully",
      });
    } else {
      throw new Error("Failed to create project");
    }
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
