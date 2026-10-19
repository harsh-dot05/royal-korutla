import { NextResponse } from 'next/server';
import { UserSession } from '@/types';
import { verifySessionToken, SESSION_COOKIE_NAME, parseCookies } from '@/lib/auth';
import { authenticateAdmin, getAdminByEmail, getAdminById } from '@/lib/adminStore';
import {
  authenticateBusinessOwner,
  getBusinessOwnerByEmail,
  getBusinessOwnerById,
} from '@/lib/businessOwnersStore';

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
 * Authenticate Business Owner credentials securely on server-side
 */
export function authenticateBusinessOwnerCredentials(
  email: string,
  password: string
): {
  success: boolean;
  user?: UserSession;
  error?: 'INVALID_CREDENTIALS' | 'ACCOUNT_INACTIVE';
  message?: string;
} {
  const result = authenticateBusinessOwner(email, password);

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
    businessId: result.user.businessId,
    createdAt: result.user.createdAt,
  };

  return {
    success: true,
    user: session,
    message: 'Business owner login successful.',
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

  // Enforce dynamic active check for Business Owners
  if (session.role === 'BUSINESS_OWNER') {
    const dbOwner = session.id
      ? getBusinessOwnerById(session.id)
      : getBusinessOwnerByEmail(session.email);
    if (dbOwner) {
      if (!dbOwner.isActive) return null;
      session.businessId = dbOwner.businessId;
      session.name = dbOwner.name;
      session.email = dbOwner.email;
    }
  } else {
    // Dynamic database check for Admins
    const dbAdmin = session.id ? getAdminById(session.id) : getAdminByEmail(session.email);
    if (dbAdmin) {
      if (!dbAdmin.is_active) return null;
      session.role = dbAdmin.role;
      session.email = dbAdmin.email;
      session.name = dbAdmin.name;
    }
  }

  return session;
}

/**
 * Enforce Business Owner authorization on API routes.
 * Strictly guarantees that businessId is server-verified from the session.
 */
export function requireBusinessOwnerApi(request: Request): {
  errorResponse: NextResponse | null;
  session: UserSession | null;
  businessId: string | null;
} {
  const session = getSessionFromRequest(request);

  if (!session) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Authentication required. Please log in to your business dashboard.',
        },
        { status: 401 }
      ),
      session: null,
      businessId: null,
    };
  }

  if (
    session.role !== 'BUSINESS_OWNER' &&
    session.role !== 'ADMIN' &&
    session.role !== 'SUPER_ADMIN'
  ) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: 'FORBIDDEN',
          message: 'Access denied. You do not have business owner permissions.',
        },
        { status: 403 }
      ),
      session,
      businessId: null,
    };
  }

  let targetBusinessId = session.businessId;
  // If an authorized admin is accessing the API, allow scoped business query via header or default
  if (!targetBusinessId && (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN')) {
    const headerBizId = request.headers.get('x-business-id');
    targetBusinessId = headerBizId || 'biz-1';
  }

  if (!targetBusinessId) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: 'FORBIDDEN',
          message: 'No authorized business linked to this account.',
        },
        { status: 403 }
      ),
      session,
      businessId: null,
    };
  }

  return {
    errorResponse: null,
    session,
    businessId: targetBusinessId,
  };
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
