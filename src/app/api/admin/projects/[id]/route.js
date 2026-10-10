import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/session';
import { updateProject, deleteProject } from '@/lib/db/repositories/projectsRepo';
import { projectSchema } from '@/lib/validation/schemas';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function PUT(request, { params }) {
  try {
    const session = await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();

    const parsed = projectSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid update data' },
        { status: 400 }
      );
    }

    const updated = await updateProject(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await logAction({
      actorEmail: session.email,
      action: 'PROJECT_UPDATED',
      resourceType: 'project',
      resourceId: id,
      details: { title: updated.title, status: updated.status }
    });

    revalidatePath('/');
    revalidatePath('/work');
    revalidatePath(`/project/${updated.slug}`);
    revalidatePath(`/project/${id}`);

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Projects PUT Error]:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await logAction({
      actorEmail: session.email,
      action: 'PROJECT_DELETED',
      resourceType: 'project',
      resourceId: id,
      details: { title: deleted.title }
    });

    revalidatePath('/');
    revalidatePath('/work');

    return NextResponse.json({ success: true, project: deleted });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Projects DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
