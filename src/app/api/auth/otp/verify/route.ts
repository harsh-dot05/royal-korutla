import { NextResponse } from 'next/server';
import {
  normalizeIndianPhone,
  findCustomerByPhone,
  createCustomer,
  updateCustomer,
} from '@/lib/customerStore';
import { verifyCustomerOtp } from '@/lib/otpService';
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getSessionFromRequest } from '@/lib/authServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, otp, purpose } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_FIELDS',
          message: 'Mobile number and verification OTP are required.',
        },
        { status: 400 }
      );
    }

    const normalized = normalizeIndianPhone(phone);
    if (!normalized.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PHONE',
          message: normalized.error || 'Invalid mobile number format.',
        },
        { status: 400 }
      );
    }

    const cleanPhone = normalized.normalized;

    if (purpose !== 'login' && purpose !== 'register' && purpose !== 'change_phone') {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PURPOSE',
          message: 'Invalid verification purpose.',
        },
        { status: 400 }
      );
    }

    // Verify OTP with server-side rate limits & attempt enforcement
    const verification = verifyCustomerOtp({
      phone: cleanPhone,
      otp: String(otp).trim(),
      purpose,
    });

    if (!verification.success) {
      const statusCode = verification.error === 'MAX_ATTEMPTS_EXCEEDED' ? 429 : 400;
      return NextResponse.json(
        {
          success: false,
          error: verification.error,
          attemptsLeft: verification.attemptsLeft,
          message: verification.message,
        },
        { status: statusCode }
      );
    }

    let customerUser = null;

    if (purpose === 'register') {
      const pendingData = verification.pendingRegistrationData;
      if (!pendingData) {
        return NextResponse.json(
          {
            success: false,
            error: 'MISSING_REGISTRATION_DATA',
            message: 'Registration session expired. Please fill in your details and try again.',
          },
          { status: 400 }
        );
      }

      // Check duplicate before creation
      const existing = findCustomerByPhone(cleanPhone);
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: 'ALREADY_EXISTS',
            message: 'An account with this mobile number already exists.',
          },
          { status: 409 }
        );
      }

      customerUser = createCustomer({
        name: pendingData.name,
        phone: cleanPhone,
        userType: pendingData.userType,
        wardNumber: pendingData.wardNumber,
        villageName: pendingData.villageName,
      });
    } else if (purpose === 'login') {
      customerUser = findCustomerByPhone(cleanPhone);
      if (!customerUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'USER_NOT_FOUND',
            message: 'No registered customer account found for this mobile number.',
          },
          { status: 404 }
        );
      }
    } else if (purpose === 'change_phone') {
      // Must have existing authenticated session to change phone
      const currentSession = getSessionFromRequest(request);
      if (!currentSession || currentSession.role !== 'CUSTOMER') {
        return NextResponse.json(
          {
            success: false,
            error: 'UNAUTHORIZED',
            message: 'You must be logged in to update your verified mobile number.',
          },
          { status: 401 }
        );
      }

      customerUser = updateCustomer(currentSession.id, { phone: cleanPhone });
      if (!customerUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'UPDATE_FAILED',
            message: 'Failed to update customer phone number.',
          },
          { status: 400 }
        );
      }
    }

    if (!customerUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'AUTHENTICATION_FAILED',
          message: 'Could not complete customer authentication.',
        },
        { status: 500 }
      );
    }

    // Generate Customer Session Token
    const sessionPayload = {
      id: customerUser.id,
      name: customerUser.name,
      email: '',
      role: 'CUSTOMER' as const,
      phone: customerUser.phone,
      userType: customerUser.userType,
      wardNumber: customerUser.wardNumber,
      villageName: customerUser.villageName,
      createdAt: customerUser.createdAt,
    };

    const token = createSessionToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      message:
        purpose === 'register'
          ? 'Registration and mobile verification successful!'
          : 'Welcome back! Signed in successfully.',
      user: {
        id: customerUser.id,
        name: customerUser.name,
        phone: customerUser.phone,
        userType: customerUser.userType,
        wardNumber: customerUser.wardNumber,
        villageName: customerUser.villageName,
        points: customerUser.points || 100,
        createdAt: customerUser.createdAt,
      },
    });

    // Set secure HTTP-Only session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to verify OTP';
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: msg,
      },
      { status: 500 }
    );
  }
}
