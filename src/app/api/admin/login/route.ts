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
          error: 'INVALID_CREDENTIALS',
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    const adminSession = authenticateAdminCredentials(email, password);

    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Invalid Admin credentials. Access denied.',
        },
        { status: 401 }
      );
    }

    const token = createSessionToken(adminSession);

    const response = NextResponse.json({
      success: true,
      user: adminSession,
      token,
      message: 'Admin login successful 👑',
    });

    // Set secure HTTP-Only cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
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
