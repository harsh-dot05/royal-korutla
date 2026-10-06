import { NextResponse } from 'next/server';
import { authenticateAdminCredentials, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Invalid admin credentials.',
        },
        { status: 401 }
      );
    }

    // Optional: try backend Express API first if BACKEND_URL is set
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    let backendToken: string | null = null;
    let adminUser: any = null;

    if (backendUrl) {
      try {
        const backendRes = await fetch(`${backendUrl}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const backendData = await backendRes.json();
        if (backendRes.ok && backendData.success && backendData.data) {
          backendToken = backendData.data.token;
          adminUser = backendData.data.user;
        }
      } catch (e) {
        // Fallback to Next.js server-side auth if backend URL is not reachable
      }
    }

    if (!adminUser) {
      adminUser = authenticateAdminCredentials(email, password);
    }

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Invalid admin credentials.',
        },
        { status: 401 }
      );
    }

    const token = backendToken || createSessionToken(adminUser);

    const response = NextResponse.json({
      success: true,
      user: adminUser,
      token,
      message: 'Admin login successful',
    });

    // Set secure HTTP-Only cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'Failed to process Admin login',
      },
      { status: 500 }
    );
  }
}
