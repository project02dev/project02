/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { storageService } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    // Test storage connection and operations
    const testResults = {
      timestamp: new Date().toISOString(),
      tests: [] as any[],
    };

    // Test 1: List files in bucket
    try {
      const listResult = await storageService.listFiles("", 10);
      testResults.tests.push({
        name: "List Files",
        status: listResult.success ? "success" : "error",
        result: listResult.success
          ? `Found ${listResult.files?.length || 0} files`
          : listResult.error,
        files: listResult.files?.slice(0, 5), // Show first 5 files
      });
    } catch (error) {
      testResults.tests.push({
        name: "List Files",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Test 2: Generate presigned upload URL
    try {
      const presignedResult = await storageService.generatePresignedUploadUrl(
        "test/test-file.txt",
        "text/plain",
        300 // 5 minutes
      );

      testResults.tests.push({
        name: "Generate Presigned URL",
        status: presignedResult.success ? "success" : "error",
        result: presignedResult.success
          ? "Presigned URL generated successfully"
          : presignedResult.error,
        hasUploadUrl: !!presignedResult.uploadUrl,
      });
    } catch (error) {
      testResults.tests.push({
        name: "Generate Presigned URL",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Test 3: Test file upload (small test file)
    try {
      const testContent = "Hello from Project02 - Test file upload";
      const testBuffer = Buffer.from(testContent, "utf-8");
      const testFileName = `test/upload-test-${Date.now()}.txt`;

      const uploadResult = await storageService.uploadFile(
        testBuffer,
        testFileName,
        "text/plain"
      );

      testResults.tests.push({
        name: "Upload Test File",
        status: uploadResult.success ? "success" : "error",
        result: uploadResult.success
          ? `File uploaded successfully: ${testFileName}`
          : uploadResult.error,
        url: uploadResult.url,
      });

      // Clean up test file
      if (uploadResult.success) {
        setTimeout(async () => {
          await storageService.deleteFile(testFileName);
        }, 5000); // Delete after 5 seconds
      }
    } catch (error) {
      testResults.tests.push({
        name: "Upload Test File",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Test 4: Configuration check
    const config = {
      hasAccessKey: !!process.env.TEBI_ACCESS_KEY,
      hasSecretKey: !!process.env.TEBI_SECRET_KEY,
      endpoint: process.env.TEBI_ENDPOINT || "https://s3.tebi.io",
      bucket: process.env.TEBI_BUCKET || "project-02-files",
    };

    testResults.tests.push({
      name: "Configuration Check",
      status: config.hasAccessKey && config.hasSecretKey ? "success" : "error",
      result: "Environment variables checked",
      config: {
        ...config,
        accessKey: config.hasAccessKey ? "Set" : "Missing",
        secretKey: config.hasSecretKey ? "Set" : "Missing",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Storage tests completed",
      results: testResults,
    });
  } catch (error) {
    console.error("Storage test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Storage test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
