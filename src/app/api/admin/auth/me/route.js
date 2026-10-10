import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !session.email) {
      return NextResponse.json({ authenticated: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: session.email,
        role: session.role || 'superadmin'
      }
    });
  } catch {
    return NextResponse.json({ authenticated: false, error: 'Unauthorized' }, { status: 401 });
  }
}
