import { NextResponse } from 'next/server';
import { requireBusinessOwnerApi } from '@/lib/authServer';
import {
  getBusinessProfile,
  getReelRequestsForBusiness,
  submitBusinessReelRequest,
} from '@/lib/businessDataStore';

export async function GET(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  const business = getBusinessProfile(auth.businessId!);
  if (!business) {
    return NextResponse.json({ success: true, data: [] });
  }

  const reels = getReelRequestsForBusiness(business.name, business.phone);
  return NextResponse.json({
    success: true,
    data: reels,
  });
}

export async function POST(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const business = getBusinessProfile(auth.businessId!);
    if (!business) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND', message: 'Business profile not found.' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { reelPurpose, preferredLanguage, additionalRequirements } = body;

    const newReel = submitBusinessReelRequest(
      business.name,
      business.phone,
      business.subCategory || business.categorySlug,
      reelPurpose || 'product_promotion',
      preferredLanguage || 'Telugu',
      additionalRequirements
    );

    return NextResponse.json({
      success: true,
      data: newReel,
      message: 'Instant Reel request submitted! Royal Korutla media team will contact you soon.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'INVALID_PAYLOAD', message: 'Failed to submit reel request.' },
      { status: 400 }
    );
  }
}
