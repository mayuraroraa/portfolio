import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { deleteMediaAsset } from '@/lib/db/repositories/mediaRepo';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function DELETE(request, { params }) {
  try {
    const session = await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deleted = await deleteMediaAsset(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    await logAction({
      actorEmail: session.email,
      action: 'MEDIA_DELETED',
      resourceType: 'media_asset',
      resourceId: id,
      details: { filename: deleted.filename }
    });

    return NextResponse.json({ success: true, asset: deleted });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message.includes('Protected')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[Media DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}
