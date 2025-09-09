import { NextRequest, NextResponse } from 'next/server';
import { storageService, fileToBuffer, FILE_TYPES } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const fileType = formData.get('fileType') as string; // 'thumbnail', 'project', 'document'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file based on type
    let allowedTypes: string[] = [];
    let maxSizeMB = 10;
    let prefix = '';

    switch (fileType) {
      case 'thumbnail':
        allowedTypes = FILE_TYPES.IMAGES;
        maxSizeMB = 5;
        prefix = `thumbnails/${projectId}/`;
        break;
      case 'project':
        allowedTypes = FILE_TYPES.ALL_PROJECT_FILES;
        maxSizeMB = 50;
        prefix = `projects/${projectId}/files/`;
        break;
      case 'document':
        allowedTypes = FILE_TYPES.DOCUMENTS;
        maxSizeMB = 20;
        prefix = `projects/${projectId}/docs/`;
        break;
      default:
        allowedTypes = FILE_TYPES.ALL_PROJECT_FILES;
        maxSizeMB = 50;
        prefix = `uploads/${projectId}/`;
    }

    // Validate file
    const validation = storageService.validateFile(file, allowedTypes, maxSizeMB);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileName = storageService.generateFileName(file.name, prefix);

    // Convert file to buffer
    const fileBuffer = await fileToBuffer(file);

    // Upload to Tebi Cloud
    const uploadResult = await storageService.uploadFile(
      fileBuffer,
      fileName,
      file.type
    );

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: uploadResult.url,
        key: fileName,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate presigned URL for direct uploads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const contentType = searchParams.get('contentType');
    const projectId = searchParams.get('projectId');
    const fileType = searchParams.get('fileType') || 'project';

    if (!fileName || !contentType || !projectId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate prefix based on file type
    let prefix = '';
    switch (fileType) {
      case 'thumbnail':
        prefix = `thumbnails/${projectId}/`;
        break;
      case 'project':
        prefix = `projects/${projectId}/files/`;
        break;
      case 'document':
        prefix = `projects/${projectId}/docs/`;
        break;
      default:
        prefix = `uploads/${projectId}/`;
    }

    const uniqueFileName = storageService.generateFileName(fileName, prefix);

    const result = await storageService.generatePresignedUploadUrl(
      uniqueFileName,
      contentType,
      3600 // 1 hour expiry
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate upload URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      uploadUrl: result.uploadUrl,
      fileName: uniqueFileName,
      publicUrl: storageService.getPublicUrl(uniqueFileName),
    });

  } catch (error) {
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
