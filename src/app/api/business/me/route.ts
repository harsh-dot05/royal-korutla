import { NextResponse } from 'next/server';
import { requireBusinessOwnerApi } from '@/lib/authServer';
import { getBusinessProfile } from '@/lib/businessDataStore';

export async function GET(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  const business = auth.businessId ? getBusinessProfile(auth.businessId) : null;

  return NextResponse.json({
    success: true,
    user: auth.session,
    business,
  });
}
