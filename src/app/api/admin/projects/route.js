import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/session';
import { getAllProjects, createProject } from '@/lib/db/repositories/projectsRepo';
import { projectSchema } from '@/lib/validation/schemas';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function GET() {
  try {
    await requireAdminSession();
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to retrieve projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await requireAdminSession();
    const body = await request.json();

    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid project data' },
        { status: 400 }
      );
    }

    const created = await createProject(parsed.data);

    await logAction({
      actorEmail: session.email,
      action: 'PROJECT_CREATED',
      resourceType: 'project',
      resourceId: created._id || created.id,
      details: { title: created.title, status: created.status }
    });

    // Invalidate caches so updates appear instantly on the public site without git commits
    revalidatePath('/');
    revalidatePath('/work');
    revalidatePath('/project/[id]', 'page');

    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Projects POST Error]:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
