import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/session';
import { updateService, deleteService } from '@/lib/db/repositories/servicesRepo';
import { serviceSchema } from '@/lib/validation/schemas';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function PUT(request, { params }) {
  try {
    const session = await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();

    const parsed = serviceSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid service update' },
        { status: 400 }
      );
    }

    const updated = await updateService(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    await logAction({
      actorEmail: session.email,
      action: 'SERVICE_UPDATED',
      resourceType: 'service',
      resourceId: id,
      details: { title: updated.title }
    });

    revalidatePath('/services');
    revalidatePath('/');

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Services PUT Error]:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deleted = await deleteService(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    await logAction({
      actorEmail: session.email,
      action: 'SERVICE_DELETED',
      resourceType: 'service',
      resourceId: id,
      details: { title: deleted.title }
    });

    revalidatePath('/services');
    revalidatePath('/');

    return NextResponse.json({ success: true, service: deleted });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Services DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
