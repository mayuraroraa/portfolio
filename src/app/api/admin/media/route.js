import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { getAllMedia } from '@/lib/db/repositories/mediaRepo';

export async function GET() {
  try {
    await requireAdminSession();
    const media = await getAllMedia();
    return NextResponse.json(media);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to retrieve media assets' }, { status: 500 });
  }
}
