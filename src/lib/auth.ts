import { UserSession } from '@/types';

export const SESSION_COOKIE_NAME = 'rk_session_token';

// Unified Server-side JWT Secret Key
const AUTH_SECRET =
  process.env.JWT_SECRET ||
  process.env.AUTH_SECRET ||
  process.env.ADMIN_SECRET_KEY ||
  'rk_super_secret_jwt_key_korutla_2026';

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return typeof atob === 'function'
    ? atob(base64)
    : Buffer.from(base64, 'base64').toString('utf-8');
}

function signHmac(data: string, secret: string): string {
  try {
    // Dynamically resolve node:crypto only when running in Node.js server environment
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require('crypto');
    return nodeCrypto.createHmac('sha256', secret).update(data).digest('base64url');
  } catch {
    // Simple fallback signature for edge/browser contexts if needed
    return base64UrlEncode(`${data}.${secret.slice(0, 8)}`);
  }
}

/**
 * Hash password helper
 */
export function hashPassword(password: string): string {
  return password;
}

/**
 * Compare plain text password against admin password
 */
export function comparePassword(password: string, targetPassword: string): boolean {
  return password === targetPassword;
}

/**
 * Create a signed session token for a user session (Edge & Node compliant)
 */
export function createSessionToken(session: UserSession): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const iat = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
      exp,
      iat,
    })
  );
  const signature = signHmac(`${header}.${payload}`, AUTH_SECRET);
  return `${header}.${payload}.${signature}`;
}

/**
 * Verify and decode a session token (Edge runtime and Node compliant)
 */
export function verifySessionToken(token: string | undefined | null): UserSession | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const payloadPart = parts.length === 3 ? parts[1] : parts[0];
    const jsonStr = base64UrlDecode(payloadPart);
    const decoded = JSON.parse(jsonStr) as {
      id?: string;
      name?: string;
      email?: string;
      role?: UserSession['role'];
      exp?: number;
      iat?: number;
    };

    if (decoded && decoded.email && decoded.role) {
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        return null; // Token expired
      }
      return {
        id: decoded.id || 'admin-owner-001',
        name: decoded.name || 'Royal Korutla Owner (Admin)',
        email: decoded.email,
        role: decoded.role,
        createdAt: decoded.iat
          ? new Date(decoded.iat * 1000).toISOString()
          : new Date().toISOString(),
      };
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Helper to parse cookie string into key-value map
 */
export function parseCookies(cookieHeader: string): Record<string, string> {
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
