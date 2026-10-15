import { NextResponse } from 'next/server';
import { createReelRequest, getAllReelRequests } from '@/lib/reelRequestsStore';
import { ReelPurpose } from '@/types';

export async function GET() {
  const requests = getAllReelRequests();
  return NextResponse.json({
    success: true,
    data: requests,
    message: 'Reel requests retrieved',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const businessName = (body.businessName || '').trim();
    const contactPhone = (body.contactPhone || '').trim();
    const businessCategory = (body.businessCategory || '').trim();
    const reelPurpose: ReelPurpose = body.reelPurpose || 'product_promotion';
    const preferredLanguage = body.preferredLanguage === 'English' ? 'English' : 'Telugu';
    const additionalRequirements = (body.additionalRequirements || '').trim();

    // Validation
    if (!businessName) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', field: 'businessName' },
          message: 'Business name is required.',
        },
        { status: 400 }
      );
    }

    if (!contactPhone) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', field: 'contactPhone' },
          message: 'Contact phone number is required.',
        },
        { status: 400 }
      );
    }

    // Clean phone validation (Indian 10-digit mobile or international format)
    const cleanPhone = contactPhone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', field: 'contactPhone' },
          message: 'Please provide a valid 10-digit contact mobile number.',
        },
        { status: 400 }
      );
    }

    if (!businessCategory) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', field: 'businessCategory' },
          message: 'Business category is required.',
        },
        { status: 400 }
      );
    }

    const validPurposes: ReelPurpose[] = [
      'product_promotion',
      'offer',
      'shop_introduction',
      'event',
      'other',
    ];

    if (!validPurposes.includes(reelPurpose)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', field: 'reelPurpose' },
          message: 'Invalid reel purpose specified.',
        },
        { status: 400 }
      );
    }

    const newRequest = createReelRequest({
      businessName,
      contactPhone,
      businessCategory,
      reelPurpose,
      preferredLanguage,
      additionalRequirements,
    });

    return NextResponse.json(
      {
        success: true,
        data: newRequest,
        message: 'Your Instant Reel request has been confirmed! Our Korutla team will call you within 24–48 hours to schedule your shoot.',
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error processing reel request';
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message },
        message: 'Unable to submit reel request right now. Please try again.',
      },
      { status: 500 }
    );
  }
}
