import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { saveMediaAsset } from '@/lib/db/repositories/mediaRepo';
import { logAction } from '@/lib/db/repositories/auditRepo';
import path from 'path';
import fs from 'fs/promises';

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

    // Sanitize filename and create unique timestamped name
    const ext = path.extname(file.name) || '.png';
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const uniqueFilename = `${baseName}_${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'assets', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFilename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/assets/uploads/${uniqueFilename}`;

    const assetRecord = await saveMediaAsset({
      filename: uniqueFilename,
      url: publicUrl,
      mimeType: file.type,
      fileSize: file.size,
      altText: altText || baseName,
      isProtected: false,
      uploadedBy: session.email
    });

    await logAction({
      actorEmail: session.email,
      action: 'MEDIA_UPLOADED',
      resourceType: 'media_asset',
      resourceId: assetRecord._id || uniqueFilename,
      details: { filename: uniqueFilename, size: file.size }
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
