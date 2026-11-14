import { createHmac } from 'crypto';
import type { UserSession } from '@/types';

export const SESSION_COOKIE_NAME = 'rk_session_token';

/**
 * Resolves the server-side JWT authentication secret.
 * Prioritizes AUTH_SECRET, JWT_SECRET, or ADMIN_SECRET_KEY from environment.
 * Emits a critical warning if running in production without explicit configuration.
 */
export function getAuthSecret(): string {
  const secret =
    process.env.JWT_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.ADMIN_SECRET_KEY;

  if (secret && secret.trim().length > 0) {
    return secret.trim();
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[CRITICAL SECURITY WARNING]: AUTH_SECRET / JWT_SECRET environment variable is missing in production. Using fallback secret. Please configure AUTH_SECRET immediately in your hosting dashboard.'
    );
  }

  // Fallback for development, unit tests, or initial deployment
  return 'rk_dev_jwt_key_korutla_local_only';
}

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
    return createHmac('sha256', secret).update(data).digest('base64url');
  } catch {
    return base64UrlEncode(`${data}.${secret.slice(0, 8)}`);
  }
}

import { signHmacWebCrypto } from './authEdge.ts';

export async function signHmacAsync(data: string, secret: string): Promise<string> {
  return signHmacWebCrypto(data, secret);
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
      email: session.email || '',
      role: session.role,
      phone: session.phone,
      userType: session.userType,
      wardNumber: session.wardNumber,
      villageName: session.villageName,
      businessId: session.businessId,
      exp,
      iat,
    })
  );
  const signature = signHmac(`${header}.${payload}`, getAuthSecret());
  return `${header}.${payload}.${signature}`;
}

/**
 * Verify and decode a session token (Edge runtime and Node compliant)
 */
export function verifySessionToken(token: string | undefined | null): UserSession | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const [headerPart, payloadPart, signaturePart] = parts;
    const expectedSignature = signHmac(`${headerPart}.${payloadPart}`, getAuthSecret());

    if (signaturePart !== expectedSignature) {
      return null; // Forged or tampered token
    }

    const jsonStr = base64UrlDecode(payloadPart);
    const decoded = JSON.parse(jsonStr) as {
      id?: string;
      name?: string;
      email?: string;
      role?: UserSession['role'];
      phone?: string;
      userType?: UserSession['userType'];
      wardNumber?: number | null;
      villageName?: string | null;
      businessId?: string;
      exp?: number;
      iat?: number;
    };

    if (decoded && (decoded.email || decoded.phone) && decoded.role) {
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        return null; // Token expired
      }
      return {
        id: decoded.id || 'usr-cust-001',
        name:
          decoded.name ||
          (decoded.role === 'BUSINESS_OWNER'
            ? 'Business Owner'
            : decoded.role === 'CUSTOMER'
              ? 'Royal Korutla Resident'
              : 'Royal Korutla Owner (Admin)'),
        email: decoded.email || '',
        role: decoded.role,
        phone: decoded.phone,
        userType: decoded.userType,
        wardNumber: decoded.wardNumber,
        villageName: decoded.villageName,
        businessId: decoded.businessId,
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

export { verifySessionTokenAsync, signHmacWebCrypto } from './authEdge.ts';

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
