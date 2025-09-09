import { NextRequest, NextResponse } from "next/server";
import { storageService } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 }
      );
    }

    // Test file paths that might exist
    const possiblePaths = [
      `projects/${projectId}/files/project-files.zip`,
      `projects/${projectId}/files/main.zip`,
      `projects/${projectId}/project.zip`,
      `uploads/${projectId}/files.zip`,
    ];

    let downloadUrl = null;
    let foundPath = null;

    // Try each possible path
    for (const path of possiblePaths) {
      try {
        const result = await storageService.getFileUrl(path, 3600);
        if (result.success) {
          downloadUrl = result.url;
          foundPath = path;
          break;
        }
      } catch (error) {
        // Continue to next path
        continue;
      }
    }

    if (!downloadUrl) {
      // If no files found, create a test download URL
      // This is for testing purposes - in production you'd have actual files
      return NextResponse.json({
        success: false,
        error: "No project files found",
        message: "Project files have not been uploaded yet",
        searchedPaths: possiblePaths,
      });
    }

    return NextResponse.json({
      success: true,
      downloadUrl,
      foundPath,
      message: "Download URL generated successfully",
    });

  } catch (error) {
    console.error("Test download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
