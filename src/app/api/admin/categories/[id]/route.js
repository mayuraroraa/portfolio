import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/session';
import { deleteCategory } from '@/lib/db/repositories/skillsRepo';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function DELETE(request, { params }) {
  try {
    const session = await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deleted = await deleteCategory(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    await logAction({
      actorEmail: session.email,
      action: 'CATEGORY_DELETED',
      resourceType: 'skill_category',
      resourceId: id,
      details: { name: deleted.name }
    });

    revalidatePath('/skills');

    return NextResponse.json({ success: true, category: deleted });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Categories DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
