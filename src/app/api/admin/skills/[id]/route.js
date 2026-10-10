import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/session';
import { updateSkill, deleteSkill } from '@/lib/db/repositories/skillsRepo';
import { skillSchema } from '@/lib/validation/schemas';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function PUT(request, { params }) {
  try {
    const session = await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();

    const parsed = skillSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid skill update' },
        { status: 400 }
      );
    }

    const updated = await updateSkill(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    await logAction({
      actorEmail: session.email,
      action: 'SKILL_UPDATED',
      resourceType: 'skill',
      resourceId: id,
      details: { name: updated.name }
    });

    revalidatePath('/skills');
    revalidatePath('/about');
    revalidatePath('/');

    return NextResponse.json({ success: true, skill: updated });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Skills PUT Error]:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deleted = await deleteSkill(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    await logAction({
      actorEmail: session.email,
      action: 'SKILL_DELETED',
      resourceType: 'skill',
      resourceId: id,
      details: { name: deleted.name }
    });

    revalidatePath('/skills');
    revalidatePath('/about');
    revalidatePath('/');

    return NextResponse.json({ success: true, skill: deleted });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Skills DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
