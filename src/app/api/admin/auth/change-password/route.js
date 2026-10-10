import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { findAdminByEmail, updateAdminPassword } from '@/lib/db/repositories/adminUsersRepo';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { passwordChangeSchema } from '@/lib/validation/schemas';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function POST(request) {
  try {
    const session = await requireAdminSession();
    const body = await request.json();
    
    const parsed = passwordChangeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid password format provided.' },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;
    const admin = await findAdminByEmail(session.email);

    if (!admin) {
      return NextResponse.json({ error: 'Administrator record not found.' }, { status: 404 });
    }

    const isMatch = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isMatch) {
      await logAction({
        actorEmail: session.email,
        action: 'PASSWORD_CHANGE_FAILED',
        resourceType: 'admin_user',
        details: { reason: 'Incorrect current password' }
      });
      return NextResponse.json({ error: 'Current password does not match.' }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    const updated = await updateAdminPassword(session.email, newHash);

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update password in database.' }, { status: 500 });
    }

    await logAction({
      actorEmail: session.email,
      action: 'PASSWORD_CHANGED',
      resourceType: 'admin_user'
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[ChangePassword API Error]:', error.name || 'UnexpectedError');
    return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 });
  }
}
