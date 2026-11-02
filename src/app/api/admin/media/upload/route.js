import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { saveMediaAsset } from '@/lib/db/repositories/mediaRepo';
import { logAction } from '@/lib/db/repositories/auditRepo';
import { uploadMediaFile } from '@/lib/storage/mediaStorage';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  try {
    const session = await requireAdminSession();
    const formData = await request.formData();
    const file = formData.get('file');
    const altText = formData.get('altText') || '';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No valid file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Disallowed file type. Only JPEG, PNG, WEBP, SVG, and GIF are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds limit of 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload via cloud adapter (Cloudinary) with automatic local fallback
    const uploadResult = await uploadMediaFile({
      buffer,
      filename: file.name,
      mimeType: file.type
    });

    const assetRecord = await saveMediaAsset({
      filename: uploadResult.filename,
      url: uploadResult.url,
      provider: uploadResult.provider,
      publicId: uploadResult.publicId,
      mimeType: file.type,
      fileSize: uploadResult.fileSize,
      altText: altText || uploadResult.filename,
      isProtected: false,
      uploadedBy: session.email
    });

    await logAction({
      actorEmail: session.email,
      action: 'MEDIA_UPLOADED',
      resourceType: 'media_asset',
      resourceId: assetRecord._id || uploadResult.filename,
      details: { filename: uploadResult.filename, provider: uploadResult.provider, size: file.size }
    });

    return NextResponse.json({
      success: true,
      asset: assetRecord
    }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Media Upload Error]:', error);
    return NextResponse.json({ error: 'Failed to upload media file' }, { status: 500 });
  }
}
