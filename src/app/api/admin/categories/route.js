import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/session';
import { createCategory } from '@/lib/db/repositories/skillsRepo';
import { categorySchema } from '@/lib/validation/schemas';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function POST(request) {
  try {
    const session = await requireAdminSession();
    const body = await request.json();

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid category data' },
        { status: 400 }
      );
    }

    const created = await createCategory(parsed.data);

    await logAction({
      actorEmail: session.email,
      action: 'CATEGORY_CREATED',
      resourceType: 'skill_category',
      resourceId: created._id || created.id,
      details: { name: created.name }
    });

    revalidatePath('/skills');

    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Categories POST Error]:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
