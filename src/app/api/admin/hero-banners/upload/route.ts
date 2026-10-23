import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/authServer';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'NO_FILE', message: 'No image file uploaded.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_TYPE',
          message: 'Invalid file format. Only JPEG, PNG, WebP, and AVIF images are supported.',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'FILE_TOO_LARGE',
          message: 'File size exceeds 5MB limit. Please upload an optimized image.',
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      message: 'Hero banner image uploaded and processed successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'UPLOAD_ERROR', message: 'Failed to process image upload.' },
      { status: 500 }
    );
  }
}
