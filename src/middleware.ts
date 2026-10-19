import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(sessionToken);

    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return redirectResponse;
    }

    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // If already logged in as ADMIN or SUPER_ADMIN and visiting /admin/login, redirect to /admin
  if (pathname === '/admin/login') {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(sessionToken);

    if (session && (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Handle /business root redirect to /business/dashboard
  if (pathname === '/business') {
    return NextResponse.redirect(new URL('/business/dashboard', request.url));
  }

  // Protect /business routes (except /business/login)
  if (pathname.startsWith('/business') && pathname !== '/business/login') {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(sessionToken);

    if (
      !session ||
      (session.role !== 'BUSINESS_OWNER' &&
        session.role !== 'ADMIN' &&
        session.role !== 'SUPER_ADMIN')
    ) {
      const loginUrl = new URL('/business/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return redirectResponse;
    }

    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // If already logged in as BUSINESS_OWNER or Admin and visiting /business/login, redirect to dashboard
  if (pathname === '/business/login') {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(sessionToken);

    if (
      session &&
      (session.role === 'BUSINESS_OWNER' ||
        session.role === 'ADMIN' ||
        session.role === 'SUPER_ADMIN')
    ) {
      return NextResponse.redirect(new URL('/business/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/business', '/business/:path*'],
};
