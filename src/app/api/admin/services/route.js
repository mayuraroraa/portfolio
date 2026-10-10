import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/session';
import { getAllServices, createService } from '@/lib/db/repositories/servicesRepo';
import { serviceSchema } from '@/lib/validation/schemas';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function GET() {
  try {
    await requireAdminSession();
    const services = await getAllServices();
    return NextResponse.json(services);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to retrieve services' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await requireAdminSession();
    const body = await request.json();

    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid service data' },
        { status: 400 }
      );
    }

    const created = await createService(parsed.data);

    await logAction({
      actorEmail: session.email,
      action: 'SERVICE_CREATED',
      resourceType: 'service',
      resourceId: created._id || created.id,
      details: { title: created.title }
    });

    revalidatePath('/services');
    revalidatePath('/');

    return NextResponse.json({ success: true, service: created }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Services POST Error]:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
