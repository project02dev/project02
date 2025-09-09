/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Tebi Cloud S3-compatible configuration
const s3Client = new S3Client({
  endpoint: "https://s3.tebi.io",
  region: "global", // Tebi ignores region, but AWS SDK requires it
  credentials: {
    accessKeyId: process.env.TEBI_ACCESS_KEY || "2ksG1MwxYVxjItZG",
    secretAccessKey:
      process.env.TEBI_SECRET_KEY || "KUPQ6j23d5BiIFfaIyoLKVIgvrffGYvTisGy8QQT",
  },
  forcePathStyle: true, // Required for S3-compatible services
});

const BUCKET_NAME = "project-02-files";

export const storageService = {
  // Upload a file to Tebi Cloud
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string = "application/octet-stream"
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
        // Make files publicly readable
        ACL: "public-read" as const,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      // Return the public URL
      const publicUrl = `https://s3.tebi.io/${BUCKET_NAME}/${fileName}`;

      return {
        success: true,
        url: publicUrl,
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  },

  // Generate a presigned URL for secure uploads
  async generatePresignedUploadUrl(
    fileName: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<{ success: boolean; uploadUrl?: string; error?: string }> {
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        ContentType: contentType,
        ACL: "public-read",
      });

      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

      return {
        success: true,
        uploadUrl,
      };
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate upload URL",
      };
    }
  },

  // Download a file (get signed URL for private files)
  async getFileUrl(
    fileName: string,
    expiresIn: number = 3600
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn });

      return {
        success: true,
        url,
      };
    } catch (error) {
      console.error("Error getting file URL:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get file URL",
      };
    }
  },

  // Get public URL for a file (for publicly accessible files)
  getPublicUrl(fileName: string): string {
    return `https://s3.tebi.io/${BUCKET_NAME}/${fileName}`;
  },

  // Delete a file
  async deleteFile(
    fileName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: fileName,
      };

      await s3Client.send(new DeleteObjectCommand(deleteParams));

      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Delete failed",
      };
    }
  },

  // List files in a directory
  async listFiles(
    prefix: string = "",
    maxKeys: number = 100
  ): Promise<{ success: boolean; files?: any[]; error?: string }> {
    try {
      const listParams = {
        Bucket: BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: maxKeys,
      };

      const response = await s3Client.send(
        new ListObjectsV2Command(listParams)
      );

      const files =
        response.Contents?.map((item) => ({
          key: item.Key,
          size: item.Size,
          lastModified: item.LastModified,
          url: `https://s3.tebi.io/${BUCKET_NAME}/${item.Key}`,
        })) || [];

      return {
        success: true,
        files,
      };
    } catch (error) {
      console.error("Error listing files:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to list files",
      };
    }
  },

  // Generate a unique file name
  generateFileName(originalName: string, prefix: string = ""): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split(".").pop();
    const baseName = originalName.split(".").slice(0, -1).join(".");

    return `${prefix}${timestamp}-${randomString}-${baseName}.${extension}`;
  },

  // Validate file type and size
  validateFile(
    file: File,
    allowedTypes: string[] = [],
    maxSizeMB: number = 10
  ): { valid: boolean; error?: string } {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    // Check file type if specified
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(
          ", "
        )}`,
      };
    }

    return { valid: true };
  },
};

// Helper function to convert File to Buffer (for Node.js environment)
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// File type constants
export const FILE_TYPES = {
  IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  DOCUMENTS: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ARCHIVES: [
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
  ],
  CODE: [
    "text/plain",
    "application/json",
    "text/javascript",
    "text/css",
    "text/html",
  ],
  ALL_PROJECT_FILES: [
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
    // Archives
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    // Code files
    "text/javascript",
    "text/css",
    "text/html",
    "application/json",
    "text/x-python",
    "text/x-java-source",
    "text/x-c",
    "text/x-c++",
  ],
};
