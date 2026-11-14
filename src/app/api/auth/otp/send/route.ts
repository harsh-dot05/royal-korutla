import { NextResponse } from 'next/server';
import {
  normalizeIndianPhone,
  validateCustomerRegistration,
  findCustomerByPhone,
} from '@/lib/customerStore';
import { sendCustomerOtp } from '@/lib/otpService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, purpose, registrationData } = body;

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'PHONE_REQUIRED',
          message: 'Mobile number is required.',
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
          message: normalized.error || 'Please enter a valid 10-digit Indian mobile number.',
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
          message: 'Invalid request purpose. Must be login, register, or change_phone.',
        },
        { status: 400 }
      );
    }

    // Existing user check
    const existingUser = findCustomerByPhone(cleanPhone);

    if (purpose === 'register') {
      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'ALREADY_REGISTERED',
            message: 'An account with this mobile number already exists. Please sign in instead.',
          },
          { status: 409 }
        );
      }

      // Validate registration fields server-side
      const regValidation = validateCustomerRegistration({
        ...registrationData,
        phone: cleanPhone,
      });

      if (!regValidation.isValid || !regValidation.cleanedData) {
        return NextResponse.json(
          {
            success: false,
            error: 'VALIDATION_FAILED',
            errors: regValidation.errors,
            message: Object.values(regValidation.errors)[0] || 'Registration validation failed.',
          },
          { status: 400 }
        );
      }

      const otpResult = await sendCustomerOtp({
        phone: cleanPhone,
        purpose: 'register',
        registrationData: {
          name: regValidation.cleanedData.name,
          userType: regValidation.cleanedData.userType,
          wardNumber: regValidation.cleanedData.wardNumber,
          villageName: regValidation.cleanedData.villageName,
        },
      });

      if (!otpResult.success) {
        const statusCode = otpResult.error === 'RATE_LIMIT_EXCEEDED' ? 429 : 400;
        return NextResponse.json(
          {
            success: false,
            error: otpResult.error,
            cooldownRemaining: otpResult.cooldownRemaining,
            message: otpResult.message,
          },
          { status: statusCode }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'WhatsApp OTP sent successfully. Please enter the 6-digit verification code.',
        cooldownRemaining: otpResult.cooldownRemaining || 60,
      });
    }

    if (purpose === 'login') {
      if (!existingUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'NOT_REGISTERED',
            message: 'No registered customer account found for this mobile number. Please register.',
          },
          { status: 404 }
        );
      }

      const otpResult = await sendCustomerOtp({
        phone: cleanPhone,
        purpose: 'login',
      });

      if (!otpResult.success) {
        const statusCode = otpResult.error === 'RATE_LIMIT_EXCEEDED' ? 429 : 400;
        return NextResponse.json(
          {
            success: false,
            error: otpResult.error,
            cooldownRemaining: otpResult.cooldownRemaining,
            message: otpResult.message,
          },
          { status: statusCode }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'WhatsApp OTP sent successfully. Please enter the 6-digit verification code.',
        cooldownRemaining: otpResult.cooldownRemaining || 60,
      });
    }

    if (purpose === 'change_phone') {
      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'ALREADY_IN_USE',
            message: 'This mobile number is already registered to another account.',
          },
          { status: 409 }
        );
      }

      const otpResult = await sendCustomerOtp({
        phone: cleanPhone,
        purpose: 'change_phone',
      });

      if (!otpResult.success) {
        const statusCode = otpResult.error === 'RATE_LIMIT_EXCEEDED' ? 429 : 400;
        return NextResponse.json(
          {
            success: false,
            error: otpResult.error,
            cooldownRemaining: otpResult.cooldownRemaining,
            message: otpResult.message,
          },
          { status: statusCode }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your new WhatsApp number.',
        cooldownRemaining: otpResult.cooldownRemaining || 60,
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
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
