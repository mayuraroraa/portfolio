import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findAdminByEmail, updateLastLogin } from '@/lib/db/repositories/adminUsersRepo';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, COOKIE_CONFIG } from '@/lib/auth/session';
import { checkRateLimit, clearRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { loginSchema } from '@/lib/validation/schemas';
import { logAction } from '@/lib/db/repositories/auditRepo';

export async function POST(request) {
  const ip = getClientIp(request);
  const rateLimitKey = `login_${ip}`;
  const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
    const minutesLeft = Math.ceil(rateLimit.resetMs / 60000);
    return NextResponse.json(
      { error: `Too many login attempts. Please try again in ${minutesLeft} minutes.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid credentials format provided.' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    const adminUser = await findAdminByEmail(normalizedEmail);

    // Constant-time-like generic rejection prevents email enumeration
    if (!adminUser || adminUser.status !== 'active') {
      await logAction({
        actorEmail: normalizedEmail,
        action: 'LOGIN_FAILED',
        resourceType: 'auth',
        details: { ip, reason: 'Account not found or inactive' }
      });
      return NextResponse.json(
        { error: 'Invalid credentials provided.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, adminUser.passwordHash);
    if (!isValid) {
      await logAction({
        actorEmail: normalizedEmail,
        action: 'LOGIN_FAILED',
        resourceType: 'auth',
        details: { ip, reason: 'Invalid password' }
      });
      return NextResponse.json(
        { error: 'Invalid credentials provided.' },
        { status: 401 }
      );
    }

    // Credentials verified: reset rate limit attempts for this IP
    clearRateLimit(rateLimitKey);

    // Generate fresh session token to prevent session fixation
    const token = await createSessionToken({
      userId: adminUser.id || adminUser._id,
      email: adminUser.email,
      role: adminUser.role || 'superadmin'
    });

    await updateLastLogin(adminUser.email);
    await logAction({
      actorEmail: adminUser.email,
      action: 'LOGIN_SUCCESS',
      resourceType: 'auth',
      details: { ip }
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_CONFIG.name, token, COOKIE_CONFIG.options);

    return NextResponse.json({
      success: true,
      user: {
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('[Login API Error]:', error.name || 'UnexpectedError');
    return NextResponse.json(
      { error: 'An unexpected internal error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
