import { NextResponse } from 'next/server';
import { UserSession } from '@/types';

export const SESSION_COOKIE_NAME = 'rk_session_token';

// Server-side secret key for token signature
const AUTH_SECRET = process.env.AUTH_SECRET || 'rk_super_secret_owner_key_2026_korutla';

// Default Owner/Admin account credentials (never exposed to browser bundles)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@royalkorutla.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'RoyalKorutla@Owner2026!';

/**
 * Simple HMAC-like signature helper for session token integrity
 */
function signPayload(payloadStr: string): string {
  let hash = 0;
  const combined = payloadStr + AUTH_SECRET;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Create a signed token string for a user session
 */
export function createSessionToken(session: UserSession): string {
  const payloadStr = JSON.stringify(session);
  const base64Payload = Buffer.from(payloadStr).toString('base64');
  const signature = signPayload(base64Payload);
  return `${base64Payload}.${signature}`;
}

/**
 * Verify and decode a session token
 */
export function verifySessionToken(token: string | undefined | null): UserSession | null {
  if (!token || !token.includes('.')) return null;

  const [base64Payload, signature] = token.split('.');
  if (!base64Payload || !signature) return null;

  const expectedSignature = signPayload(base64Payload);
  if (signature !== expectedSignature) return null;

  try {
    const payloadStr = Buffer.from(base64Payload, 'base64').toString('utf-8');
    const session: UserSession = JSON.parse(payloadStr);
    return session;
  } catch (e) {
    return null;
  }
}

/**
 * Authenticate Admin credentials securely on server-side
 */
export function authenticateAdminCredentials(email: string, password: string): UserSession | null {
  const cleanEmail = email.trim().toLowerCase();
  const targetEmail = ADMIN_EMAIL.toLowerCase();

  if (cleanEmail === targetEmail && password === ADMIN_PASSWORD) {
    return {
      id: 'admin-owner-001',
      name: 'Royal Korutla Owner (Admin)',
      email: ADMIN_EMAIL,
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
    };
  }

  return null;
}

/**
 * Get user session from Request headers / cookies
 */
export function getSessionFromRequest(request: Request): UserSession | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const token = cookies[SESSION_COOKIE_NAME];

  if (!token) {
    // Also check Authorization header: Bearer <token>
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return verifySessionToken(authHeader.substring(7));
    }
    return null;
  }

  return verifySessionToken(token);
}

/**
 * Enforce Admin authorization on API routes.
 * Returns null if user is authorized ADMIN.
 * Returns NextResponse (401 or 403) if unauthorized.
 */
export function requireAdminApi(request: Request): NextResponse | null {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required. Please login as Admin.',
      },
      { status: 401 }
    );
  }

  if (session.role !== 'ADMIN') {
    return NextResponse.json(
      {
        success: false,
        error: 'FORBIDDEN',
        message: 'Access denied. You do not have ADMIN permissions.',
      },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Helper to parse cookie string into key-value map
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const list: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      list[name] = decodeURIComponent(val);
    }
  });
  return list;
}
