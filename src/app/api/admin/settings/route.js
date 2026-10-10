import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/session';
import { getSiteSettings, updateSiteSettings } from '@/lib/db/repositories/settingsRepo';
import { profileSettingsSchema } from '@/lib/validation/schemas';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function GET() {
  try {
    await requireAdminSession();
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to retrieve site settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await requireAdminSession();
    const body = await request.json();

    const parsed = profileSettingsSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid settings data' },
        { status: 400 }
      );
    }

    const updated = await updateSiteSettings(parsed.data);

    await logAction({
      actorEmail: session.email,
      action: 'SITE_SETTINGS_UPDATED',
      resourceType: 'site_settings',
      details: { updatedFields: Object.keys(parsed.data) }
    });

    // Revalidate public routes
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/services');
    revalidatePath('/work');
    revalidatePath('/skills');

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Settings PUT Error]:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
