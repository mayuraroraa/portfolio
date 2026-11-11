
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'mayur_admin_session';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Validates the JWT session cookie.
 */
async function hasValidSession(token) {
  if (!JWT_SECRET || !token || typeof token !== 'string') {
    return false;
  }

  try {
    const key = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });

    return Boolean(payload?.email);
  } catch {
    return false;
  }
}

/**
 * Applies security headers to outgoing responses.
 */
function applySecurityHeaders(response) {
  response.headers.set('X-Frame-Options', 'DENY');

  response.headers.set(
    'X-Content-Type-Options',
    'nosniff'
  );

  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );

  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com",
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net data:",
    "img-src 'self' data: blob: https:",
    "media-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set(
    'Content-Security-Policy-Report-Only',
    csp
  );

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  return response;
}

/**
 * Main Proxy function.
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get(
    SESSION_COOKIE_NAME
  )?.value;

  const isAuthenticated = await hasValidSession(sessionToken);

  // 1. Admin entry point
  if (pathname === '/admin') {
    const destination = isAuthenticated
      ? '/admin/dashboard'
      : '/admin/login';

    return applySecurityHeaders(
      NextResponse.redirect(
        new URL(destination, request.url)
      )
    );
  }

  // 2. Admin login page
  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      return applySecurityHeaders(
        NextResponse.redirect(
          new URL('/admin/dashboard', request.url)
        )
      );
    }

    return applySecurityHeaders(NextResponse.next());
  }

  // 3. Admin API routes
  if (pathname.startsWith('/api/admin')) {

    // Allow login without authentication
    if (pathname === '/api/admin/auth/login') {
      return applySecurityHeaders(NextResponse.next());
    }

    // Reject unauthenticated requests
    if (!isAuthenticated) {
      return applySecurityHeaders(
        NextResponse.json(
          {
            error: 'Unauthorized: Valid administrator session required.',
          },
          { status: 401 }
        )
      );
    }

    return applySecurityHeaders(NextResponse.next());
  }

  // 4. Protected admin pages
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return applySecurityHeaders(
        NextResponse.redirect(
          new URL('/admin/login', request.url)
        )
      );
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

/**
 * Routes where Proxy should execute.
 */
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
