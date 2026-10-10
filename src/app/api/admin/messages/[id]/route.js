import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { updateMessageStatus, deleteMessage } from '@/lib/db/repositories/messagesRepo';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function PUT(request, { params }) {
  try {
    const session = await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();

    const status = body.status;
    if (!['read', 'unread', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await updateMessageStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await logAction({
      actorEmail: session.email,
      action: 'MESSAGE_STATUS_UPDATED',
      resourceType: 'contact_message',
      resourceId: id,
      details: { status }
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Messages PUT Error]:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deleted = await deleteMessage(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await logAction({
      actorEmail: session.email,
      action: 'MESSAGE_DELETED',
      resourceType: 'contact_message',
      resourceId: id
    });

    return NextResponse.json({ success: true, message: deleted });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Messages DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
