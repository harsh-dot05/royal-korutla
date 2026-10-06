import { NextResponse } from 'next/server';
import { requireAdminApi, getSessionFromRequest } from '@/lib/authServer';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const session = getSessionFromRequest(request);

  return NextResponse.json({
    success: true,
    user: session,
  });
}
