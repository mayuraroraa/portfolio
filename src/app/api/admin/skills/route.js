import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/session';
import { getAllSkills, getAllCategories, createSkill } from '@/lib/db/repositories/skillsRepo';
import { skillSchema } from '@/lib/validation/schemas';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function GET() {
  try {
    await requireAdminSession();
    const [skills, categories] = await Promise.all([
      getAllSkills(),
      getAllCategories()
    ]);
    return NextResponse.json({ skills, categories });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to retrieve skills' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await requireAdminSession();
    const body = await request.json();

    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid skill data' },
        { status: 400 }
      );
    }

    const created = await createSkill(parsed.data);

    await logAction({
      actorEmail: session.email,
      action: 'SKILL_CREATED',
      resourceType: 'skill',
      resourceId: created._id || created.name,
      details: { name: created.name, categoryId: created.categoryId }
    });

    revalidatePath('/skills');
    revalidatePath('/about');
    revalidatePath('/');

    return NextResponse.json({ success: true, skill: created }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Skills POST Error]:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
