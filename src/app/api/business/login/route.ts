import { NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { authenticateBusinessOwnerCredentials } from '@/lib/authServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Please enter both email and password.',
        },
        { status: 400 }
      );
    }

    const authResult = authenticateBusinessOwnerCredentials(email, password);

    if (!authResult.success || !authResult.user) {
      const statusCode = authResult.error === 'ACCOUNT_INACTIVE' ? 403 : 401;
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'INVALID_CREDENTIALS',
          message: authResult.message || 'Invalid email or password.',
        },
        { status: statusCode }
      );
    }

    const businessOwner = authResult.user;
    const token = createSessionToken(businessOwner);

    const response = NextResponse.json({
      success: true,
      user: businessOwner,
      token,
      message: 'Business Owner login successful',
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
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'Failed to process Business Owner login.',
      },
      { status: 500 }
    );
  }
}
