import { NextResponse } from 'next/server';
import { requireBusinessOwnerApi } from '@/lib/authServer';
import { getBusinessSubscription } from '@/lib/businessDataStore';

export async function GET(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  const subscription = getBusinessSubscription(auth.businessId!);

  return NextResponse.json({
    success: true,
    data: subscription,
  });
}
