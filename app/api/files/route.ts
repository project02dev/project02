import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage';

// List files for a project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const fileType = searchParams.get('fileType'); // 'thumbnails', 'files', 'docs', or 'all'

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    let prefix = '';
    switch (fileType) {
      case 'thumbnails':
        prefix = `thumbnails/${projectId}/`;
        break;
      case 'files':
        prefix = `projects/${projectId}/files/`;
        break;
      case 'docs':
        prefix = `projects/${projectId}/docs/`;
        break;
      case 'all':
        prefix = `projects/${projectId}/`;
        break;
      default:
        prefix = `projects/${projectId}/`;
    }

    const result = await storageService.listFiles(prefix, 100);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to list files' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      files: result.files,
      count: result.files?.length || 0,
    });

  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    const result = await storageService.deleteFile(fileName);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });

  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
