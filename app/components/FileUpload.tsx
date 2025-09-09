/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef } from "react";
import {
  FiUpload,
  FiFile,
  FiImage,
  FiX,
  FiCheck,
  FiLoader,
} from "react-icons/fi";

interface FileUploadProps {
  projectId: string;
  fileType: "thumbnail" | "project" | "document";
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  key: string;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
  result?: UploadedFile;
}

export default function FileUpload({
  projectId,
  fileType,
  accept,
  maxSizeMB = 10,
  multiple = false,
  onUploadComplete,
  onUploadError,
  className = "",
}: FileUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptTypes = () => {
    if (accept) return accept;

    switch (fileType) {
      case "thumbnail":
        return "image/*";
      case "document":
        return ".pdf,.doc,.docx,.txt,.md";
      case "project":
        return "*/*";
      default:
        return "*/*";
    }
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    // Check file type for thumbnails
    if (fileType === "thumbnail" && !file.type.startsWith("image/")) {
      return {
        valid: false,
        error: "Only image files are allowed for thumbnails",
      };
    }

    return { valid: true };
  };

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    formData.append("fileType", fileType);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Upload failed");
    }

    return result.file;
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);

    // Validate files
    for (const file of fileArray) {
      const validation = validateFile(file);
      if (!validation.valid) {
        onUploadError?.(validation.error || "Invalid file");
        return;
      }
    }

    // Initialize upload progress
    const newUploads: UploadProgress[] = fileArray.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    // Upload files
    const uploadPromises = fileArray.map(async (file, index) => {
      try {
        const result = await uploadFile(file);

        setUploads((prev) =>
          prev.map((upload, i) =>
            upload.file === file
              ? { ...upload, progress: 100, status: "completed", result }
              : upload
          )
        );

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";

        setUploads((prev) =>
          prev.map((upload, i) =>
            upload.file === file
              ? { ...upload, status: "error", error: errorMessage }
              : upload
          )
        );

        throw error;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      onUploadComplete?.(results);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Some uploads failed";
      onUploadError?.(errorMessage);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const removeUpload = (file: File) => {
    setUploads((prev) => prev.filter((upload) => upload.file !== file));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (
      ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
    ) {
      return <FiImage className="w-5 h-5" />;
    }

    return <FiFile className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <FiUpload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          {fileType === "thumbnail" && "Images only, "}
          Max {maxSizeMB}MB per file
          {multiple && ", multiple files allowed"}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptTypes()}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Upload Progress</h4>
          {uploads.map((upload, index) => (
            <div key={index} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getFileIcon(upload.file.name)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {upload.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(upload.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {upload.status === "uploading" && (
                    <FiLoader className="w-4 h-4 animate-spin text-indigo-600" />
                  )}
                  {upload.status === "completed" && (
                    <FiCheck className="w-4 h-4 text-green-600" />
                  )}
                  {upload.status === "error" && (
                    <FiX className="w-4 h-4 text-red-600" />
                  )}

                  <button
                    onClick={() => removeUpload(upload.file)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {upload.status === "uploading" && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}

              {upload.status === "error" && upload.error && (
                <p className="text-sm text-red-600 mt-2">{upload.error}</p>
              )}

              {upload.status === "completed" && upload.result && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">
                    Upload completed successfully
                  </p>
                  <a
                    href={upload.result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View file
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
