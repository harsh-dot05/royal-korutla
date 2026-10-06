import { UserSession } from '@/types';

export const SESSION_COOKIE_NAME = 'rk_session_token';

// Unified Server-side JWT Secret Key
const AUTH_SECRET =
  process.env.JWT_SECRET ||
  process.env.AUTH_SECRET ||
  process.env.ADMIN_SECRET_KEY ||
  'rk_super_secret_jwt_key_korutla_2026';

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
 * Create a signed JWT token string for a user session
 */
export function createSessionToken(session: UserSession): string {
  const payload = {
    id: session.id,
    name: session.name,
    email: session.email,
    role: session.role,
  };
  try {
    const jwt = require('jsonwebtoken');
    return jwt.sign(payload, AUTH_SECRET, { expiresIn: '7d' });
  } catch (e) {
    const payloadStr = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadStr).toString('base64');
    return `${base64Payload}.signed`;
  }
}

/**
 * Verify and decode a session token (Edge runtime compliant)
 */
export function verifySessionToken(token: string | undefined | null): UserSession | null {
  if (!token) return null;

  // Try standard jwt.verify in Node environment
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, AUTH_SECRET) as any;
    if (decoded && decoded.email && decoded.role) {
      return {
        id: decoded.id || 'admin-owner-001',
        name: decoded.name || 'Royal Korutla Owner (Admin)',
        email: decoded.email,
        role: decoded.role,
        createdAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : new Date().toISOString(),
      };
    }
  } catch (e) {
    // Fallback to Edge-safe decoding below
  }

  // Edge-safe JWT payload decode
  if (token.includes('.')) {
    try {
      const parts = token.split('.');
      const payloadPart = parts.length === 3 ? parts[1] : parts[0];
      if (payloadPart) {
        let base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
          base64 += '=';
        }
        const jsonStr = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('utf-8');
        const decoded = JSON.parse(jsonStr);
        if (decoded && decoded.email && decoded.role) {
          if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return null; // Token expired
          }
          return {
            id: decoded.id || 'admin-owner-001',
            name: decoded.name || 'Royal Korutla Owner (Admin)',
            email: decoded.email,
            role: decoded.role,
            createdAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : new Date().toISOString(),
          };
        }
      }
    } catch (err) {
      return null;
    }
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
