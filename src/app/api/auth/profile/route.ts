import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/authServer';
import {
  findCustomerById,
  updateCustomer,
  validateCustomerRegistration,
} from '@/lib/customerStore';
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

/**
 * GET: Fetch authenticated customer profile
 */
export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);

    if (!session || session.role !== 'CUSTOMER') {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Customer authentication required to view profile.',
        },
        { status: 401 }
      );
    }

    const customer = findCustomerById(session.id);

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: 'NOT_FOUND',
          message: 'Customer account not found.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        userType: customer.userType,
        wardNumber: customer.wardNumber,
        villageName: customer.villageName,
        isVerified: customer.isVerified,
        points: customer.points || 100,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'Failed to retrieve profile.',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update authenticated customer profile (name, residency, ward/village)
 * Note: Changing mobile number requires OTP verification through /api/auth/otp/verify with purpose: 'change_phone'
 */
export async function PUT(request: Request) {
  try {
    const session = getSessionFromRequest(request);

    if (!session || session.role !== 'CUSTOMER') {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Customer authentication required to update profile.',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, userType, wardNumber, villageName } = body;

    const validation = validateCustomerRegistration({
      name,
      phone: session.phone || '+919440123456', // Phone is not changed via this endpoint
      userType,
      wardNumber,
      villageName,
    });

    if (!validation.isValid || !validation.cleanedData) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_FAILED',
          errors: validation.errors,
          message: Object.values(validation.errors)[0] || 'Validation failed.',
        },
        { status: 400 }
      );
    }

    const updated = updateCustomer(session.id, {
      name: validation.cleanedData.name,
      userType: validation.cleanedData.userType,
      wardNumber: validation.cleanedData.wardNumber,
      villageName: validation.cleanedData.villageName,
    });

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: 'UPDATE_FAILED',
          message: 'Customer account not found or could not be updated.',
        },
        { status: 404 }
      );
    }

    // Refresh session cookie with updated customer name & details
    const refreshedToken = createSessionToken({
      id: updated.id,
      name: updated.name,
      email: '',
      role: 'CUSTOMER',
      phone: updated.phone,
      userType: updated.userType,
      wardNumber: updated.wardNumber,
      villageName: updated.villageName,
      createdAt: updated.createdAt,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        userType: updated.userType,
        wardNumber: updated.wardNumber,
        villageName: updated.villageName,
        isVerified: updated.isVerified,
        points: updated.points || 100,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: refreshedToken,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Server error occurred.';
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
