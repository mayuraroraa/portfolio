import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

/**
 * Uploads an image buffer to Cloudinary using the secure REST API.
 * Uses native Node crypto and fetch; requires no external SDK dependencies.
 */
async function uploadToCloudinary({ buffer, filename, mimeType, folder = 'mayur_portfolio/media' }) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const timestamp = Math.floor(Date.now() / 1000);
  const ext = path.extname(filename) || '';
  const sanitizedName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const publicId = `${folder}/${sanitizedName}_${Date.now()}`;
  
  // Cloudinary signature requires parameters sorted alphabetically
  const strToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

  const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;

  const formData = new FormData();
  formData.append('file', base64Data);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('signature', signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Cloudinary upload failed with status ${response.status}`);
  }

  const result = await response.json();
  return {
    url: result.secure_url || result.url,
    provider: 'cloudinary',
    publicId: result.public_id,
    filename: `${result.public_id.split('/').pop()}.${result.format || 'png'}`,
    fileSize: result.bytes || buffer.length,
    mimeType: mimeType
  };
}

/**
 * Saves file locally to public/assets/uploads (for local development fallback).
 */
async function uploadToLocal({ buffer, filename, mimeType }) {
  const ext = path.extname(filename) || '.png';
  const baseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const uniqueFilename = `${baseName}_${Date.now()}${ext}`;

  const uploadDir = path.join(process.cwd(), 'public', 'assets', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, uniqueFilename);
  await fs.writeFile(filePath, buffer);

  return {
    url: `/assets/uploads/${uniqueFilename}`,
    provider: 'local',
    publicId: uniqueFilename,
    filename: uniqueFilename,
    fileSize: buffer.length,
    mimeType: mimeType
  };
}

/**
 * Unified media upload adapter.
 * Prefers Cloudinary in production/serverless, falls back to local storage in development.
 */
export async function uploadMediaFile({ buffer, filename, mimeType }) {
  if (isCloudinaryConfigured) {
    try {
      return await uploadToCloudinary({ buffer, filename, mimeType });
    } catch (err) {
      console.warn('[Storage] Cloudinary upload error, checking fallback:', err.message);
      // In local dev, fallback to disk if Cloudinary fails
      if (process.env.NODE_ENV !== 'production') {
        return await uploadToLocal({ buffer, filename, mimeType });
      }
      throw err;
    }
  }

  // If in production without Cloudinary or Blob credentials, warn
  if (process.env.NODE_ENV === 'production') {
    console.warn('[Storage Warning]: Cloudinary is not configured. Local disk writes on Vercel are ephemeral.');
  }

  return await uploadToLocal({ buffer, filename, mimeType });
}

/**
 * Deletes a media file from its respective storage provider.
 */
export async function deleteMediaFile({ provider, publicId, filename }) {
  if (provider === 'cloudinary' || (publicId && isCloudinaryConfigured && !publicId.endsWith('.png') && !publicId.endsWith('.jpg'))) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) return { skipped: true };

    const timestamp = Math.floor(Date.now() / 1000);
    const strToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    await fetch(endpoint, { method: 'POST', body: formData }).catch(err => {
      console.warn('[Storage] Could not destroy Cloudinary asset:', err.message);
    });
    return { success: true };
  }

  // Local filesystem cleanup
  try {
    const localName = filename || publicId;
    if (localName && !localName.includes('..') && !localName.includes('/')) {
      const filePath = path.join(process.cwd(), 'public', 'assets', 'uploads', localName);
      await fs.unlink(filePath).catch(() => {});
    }
  } catch {}

  return { success: true };
}
