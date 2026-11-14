import type { UserSession } from '@/types';

export const SESSION_COOKIE_NAME = 'rk_session_token';

/**
 * Resolves the JWT authentication secret (Universal Edge/Node).
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

  return 'rk_dev_jwt_key_korutla_local_only';
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

/**
 * Pure W3C Web Crypto API HMAC-SHA256 signature generator.
 * Runs in Edge Runtime, Netlify Edge Functions, Node.js 18+, and browsers without Node.js dependencies.
 */
export async function signHmacWebCrypto(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const bytes = new Uint8Array(signature);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Universal Edge-compatible session token verifier.
 */
export async function verifySessionTokenAsync(token: string | undefined | null): Promise<UserSession | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const [headerPart, payloadPart, signaturePart] = parts;
    const expectedSignature = await signHmacWebCrypto(`${headerPart}.${payloadPart}`, getAuthSecret());

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
