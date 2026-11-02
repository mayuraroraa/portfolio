import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'mayur_admin_session';

// Strict security enforcement: In production, JWT_SECRET MUST be set to prevent token forgery
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing or shorter than 32 characters in production.');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev_mayur_antigravity_jwt_secret_key_849204928472910_min32chars';
const key = new TextEncoder().encode(JWT_SECRET);

function getSigningKey() {
  if (process.env.NODE_ENV === 'production') {
    const prodSecret = process.env.JWT_SECRET;
    if (!prodSecret || prodSecret.length < 32) {
      throw new Error('FATAL: In production, JWT_SECRET must be configured and contain at least 32 characters.');
    }
    return new TextEncoder().encode(prodSecret);
  }
  return key;
}

export const COOKIE_CONFIG = {
  name: SESSION_COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days in seconds
  }
};

/**
 * Creates and cryptographically signs a JWT session token with embedded metadata.
 * @param {object} payload - Session payload (email, role, id)
 * @returns {Promise<string>}
 */
export async function createSessionToken(payload) {
  const signingKey = getSigningKey();
  const sessionId = payload.sessionId || crypto.randomUUID();
  return await new SignJWT({
    email: payload.email.toLowerCase().trim(),
    role: payload.role || 'superadmin',
    userId: payload.userId || payload.id || '',
    sessionId
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(signingKey);
}

/**
 * Verifies a JWT session token signature, structure, and expiration.
 * @param {string} token 
 * @returns {Promise<object|null>}
 */
export async function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const verificationKey = getSigningKey();
    const { payload } = await jwtVerify(token, verificationKey, {
      algorithms: ['HS256']
    });
    if (!payload?.email) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Helper to get active administrator session from HTTP-only cookie
 * in Server Components, Route Handlers, and Server Actions.
 * Safely resolves cookies from next/headers.
 * @returns {Promise<object|null>}
 */
export async function getAdminSession() {
  try {
    let nextHeaders;
    try {
      nextHeaders = await import('next/headers');
    } catch {
      nextHeaders = await import('next/headers.js');
    }
    const cookieStore = await nextHeaders.cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) {
      return null;
    }
    const payload = await verifySessionToken(sessionCookie.value);
    if (!payload) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Server-side authorization guard.
 * Validates session or throws 'Unauthorized' error.
 * @returns {Promise<object>}
 */
export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session || !session.email) {
    throw new Error('Unauthorized');
  }
  return session;
}
