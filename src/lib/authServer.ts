import { NextResponse } from 'next/server';
import { UserSession } from '@/types';
import { verifySessionToken, SESSION_COOKIE_NAME, parseCookies } from '@/lib/auth';
import { authenticateAdmin, getAdminByEmail, getAdminById } from '@/lib/adminStore';

/**
 * Authenticate Admin credentials securely on server-side
 */
export function authenticateAdminCredentials(email: string, password: string): {
  success: boolean;
  user?: UserSession;
  error?: 'INVALID_CREDENTIALS' | 'ACCOUNT_INACTIVE';
  message?: string;
} {
  const result = authenticateAdmin(email, password);

  if (!result.success || !result.user) {
    return {
      success: false,
      error: result.error || 'INVALID_CREDENTIALS',
      message: result.message || 'Invalid credentials.',
    };
  }

  const session: UserSession = {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    role: result.user.role,
    createdAt: result.user.created_at,
  };

  return {
    success: true,
    user: session,
    message: 'Login successful.',
  };
}

/**
 * Get user session from Request headers / cookies and validate active DB status
 */
export function getSessionFromRequest(request: Request): UserSession | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const token = cookies[SESSION_COOKIE_NAME];

  let session: UserSession | null = null;

  if (token) {
    session = verifySessionToken(token);
  } else {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      session = verifySessionToken(authHeader.substring(7));
    }
  }

  if (!session) return null;

  // Perform dynamic database check to enforce immediate deactivation
  const dbAdmin = session.id ? getAdminById(session.id) : getAdminByEmail(session.email);
  if (dbAdmin) {
    if (!dbAdmin.is_active) return null;
    session.role = dbAdmin.role;
    session.email = dbAdmin.email;
    session.name = dbAdmin.name;
  }

  return session;
}

/**
 * Enforce Admin authorization (ADMIN or SUPER_ADMIN) on API routes.
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

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
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
 * Enforce SUPER_ADMIN authorization on API routes.
 */
export function requireSuperAdminApi(request: Request): NextResponse | null {
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

  if (session.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      {
        success: false,
        error: 'FORBIDDEN',
        message: 'Access denied. Only SUPER_ADMIN can perform this operation.',
      },
      { status: 403 }
    );
  }

  return null;
}
