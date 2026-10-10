import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_CONFIG, getAdminSession } from '@/lib/auth/session';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function POST() {
  try {
    const session = await getAdminSession();
    if (session?.email) {
      await logAction({
        actorEmail: session.email,
        action: 'LOGOUT',
        resourceType: 'auth'
      });
    }

    const cookieStore = await cookies();
    // Invalidate cookie thoroughly across all browser clients
    cookieStore.set(COOKIE_CONFIG.name, '', {
      ...COOKIE_CONFIG.options,
      maxAge: 0,
      expires: new Date(0)
    });
    cookieStore.delete(COOKIE_CONFIG.name);

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('[Logout API Error]:', error.name || 'UnexpectedError');
    return NextResponse.json({ success: true });
  }
}
