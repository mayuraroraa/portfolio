import { NextResponse } from 'next/server';
import { requireAdminSession, createSessionToken, COOKIE_CONFIG } from '@/lib/auth/session';
import { findAdminByEmail, updateAdminEmail } from '@/lib/db/repositories/adminUsersRepo';
import { verifyPassword } from '@/lib/auth/password';
import { logAction } from '@/lib/db/repositories/auditRepo';
import { z } from 'zod';

const emailChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newEmail: z.string().email('Please enter a valid email address').max(255)
});

export async function POST(request) {
  try {
    const session = await requireAdminSession();
    const body = await request.json();

    const parsed = emailChangeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid email format provided.' },
        { status: 400 }
      );
    }

    const { currentPassword, newEmail } = parsed.data;
    const admin = await findAdminByEmail(session.email);

    if (!admin) {
      return NextResponse.json({ error: 'Administrator record not found.' }, { status: 404 });
    }

    const isMatch = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isMatch) {
      await logAction({
        actorEmail: session.email,
        action: 'EMAIL_CHANGE_FAILED',
        resourceType: 'admin_user',
        details: { reason: 'Incorrect current password' }
      });
      return NextResponse.json({ error: 'Current password does not match.' }, { status: 400 });
    }

    await updateAdminEmail(session.email, newEmail);

    await logAction({
      actorEmail: session.email,
      action: 'EMAIL_CHANGED',
      resourceType: 'admin_user',
      details: { oldEmail: session.email, newEmail }
    });

    // Create fresh session token for the new email
    const newToken = await createSessionToken({
      email: newEmail,
      role: session.role || 'superadmin',
      id: session.id || session.userId
    });

    const response = NextResponse.json({
      success: true,
      message: 'Administrator email updated successfully.',
      newEmail
    });

    response.cookies.set(COOKIE_CONFIG.name, newToken, COOKIE_CONFIG.options);
    return response;
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message?.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error('[ChangeEmail API Error]:', error.name || 'UnexpectedError');
    return NextResponse.json({ error: 'Failed to update email in database.' }, { status: 500 });
  }
}
