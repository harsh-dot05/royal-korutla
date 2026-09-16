import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(sessionToken);

    if (!session || session.role !== 'ADMIN') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in as ADMIN and visiting /admin/login, redirect to /admin
  if (pathname === '/admin/login') {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(sessionToken);

    if (session && session.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
