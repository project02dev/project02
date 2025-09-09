import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase/config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";
import { storageService } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    // Get user ID from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Check if user has purchased this project
    const purchasesQuery = query(
      collection(db, "purchases"),
      where("projectId", "==", projectId),
      where("buyerId", "==", userId),
      where("accessGranted", "==", true)
    );

    const purchaseSnapshot = await getDocs(purchasesQuery);

    if (purchaseSnapshot.empty) {
      return NextResponse.json(
        { error: "Access denied. Project not purchased or access revoked." },
        { status: 403 }
      );
    }

    const purchase = purchaseSnapshot.docs[0];
    const purchaseData = purchase.data();

    // Check download limits
    if (purchaseData.downloadCount >= 5) {
      // Max 5 downloads
      return NextResponse.json(
        { error: "Download limit exceeded" },
        { status: 403 }
      );
    }

    // Get project files from storage
    try {
      // List files in the project directory
      const projectFilesPath = `projects/${projectId}/files/`;

      // For now, we'll assume there's a main project file
      // In production, you should list actual files from storage
      const mainFileName = `${projectFilesPath}project-files.zip`;

      // Try multiple possible file paths
      const possiblePaths = [
        `${projectFilesPath}project-files.zip`,
        `${projectFilesPath}main.zip`,
        `projects/${projectId}/project.zip`,
        `uploads/${projectId}/files.zip`,
        `${projectFilesPath}download.zip`,
      ];

      let downloadResult = null;
      let foundPath = null;

      // Try each possible path
      for (const path of possiblePaths) {
        try {
          const result = await storageService.getFileUrl(path, 3600);
          if (result.success) {
            downloadResult = result;
            foundPath = path;
            break;
          }
        } catch (error) {
          // Continue to next path
          continue;
        }
      }

      if (!downloadResult || !downloadResult.success) {
        return NextResponse.json(
          {
            error: "Project files not found",
            message:
              "The project files have not been uploaded yet or are not available for download.",
            searchedPaths: possiblePaths,
          },
          { status: 404 }
        );
      }

      // Update download count
      await updateDoc(doc(db, "purchases", purchase.id), {
        downloadCount: increment(1),
        lastDownloadAt: new Date(),
      });

      // Return the download URL
      return NextResponse.json({
        success: true,
        downloadUrl: downloadResult.url,
        remainingDownloads: 5 - (purchaseData.downloadCount + 1),
        message:
          "Download link generated successfully. Link expires in 1 hour.",
      });
    } catch (storageError) {
      console.error("Storage error:", storageError);
      return NextResponse.json(
        { error: "Failed to access project files" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Download API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Alternative endpoint for direct file downloads with authentication
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await request.json();
    const { userId, fileName } = body;

    if (!userId || !fileName) {
      return NextResponse.json(
        { error: "User ID and file name required" },
        { status: 400 }
      );
    }

    // Verify purchase access (same as GET method)
    const purchasesQuery = query(
      collection(db, "purchases"),
      where("projectId", "==", projectId),
      where("buyerId", "==", userId),
      where("accessGranted", "==", true)
    );

    const purchaseSnapshot = await getDocs(purchasesQuery);

    if (purchaseSnapshot.empty) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Generate download URL for specific file
    const filePath = `projects/${projectId}/files/${fileName}`;
    const downloadResult = await storageService.getFileUrl(filePath, 3600);

    if (!downloadResult.success) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      downloadUrl: downloadResult.url,
      fileName: fileName,
    });
  } catch (error) {
    console.error("File download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
