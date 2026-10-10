import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'mayur_admin_session';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_mayur_antigravity_jwt_secret_key_849204928472910_min32chars';
const key = new TextEncoder().encode(JWT_SECRET);

/**
 * Validates the JWT session cookie using jose on Edge / Server runtime.
 * @param {string|undefined} token 
 * @returns {Promise<boolean>}
 */
async function hasValidSession(token) {
  if (!token || typeof token !== 'string') return false;
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256']
    });
    return Boolean(payload?.email);
  } catch {
    return false;
  }
}

/**
 * Applies security headers to an outgoing response.
 * @param {NextResponse} response 
 * @returns {NextResponse}
 */
function applySecurityHeaders(response) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'"
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  return response;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = await hasValidSession(sessionToken);

  // 1. Entry point: /admin
  if (pathname === '/admin') {
    if (isAuthenticated) {
      return applySecurityHeaders(NextResponse.redirect(new URL('/admin/dashboard', request.url)));
    }
    return applySecurityHeaders(NextResponse.redirect(new URL('/admin/login', request.url)));
  }

  // 2. Login page: /admin/login
  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      return applySecurityHeaders(NextResponse.redirect(new URL('/admin/dashboard', request.url)));
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // 3. Protected admin routes (/admin/dashboard, /admin/projects, /admin/settings, etc.)
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};
