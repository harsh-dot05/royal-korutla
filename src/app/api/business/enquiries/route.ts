import { NextResponse } from 'next/server';
import { requireBusinessOwnerApi } from '@/lib/authServer';
import {
  getEnquiriesByBusinessId,
  updateEnquiryStatus,
  getEnquiryById,
} from '@/lib/businessDataStore';

export async function GET(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  const enquiries = getEnquiriesByBusinessId(auth.businessId!);
  return NextResponse.json({
    success: true,
    data: enquiries,
  });
}

export async function PATCH(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json();
    const { id, status, responseNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'MISSING_FIELDS', message: 'Enquiry ID and status are required.' },
        { status: 400 }
      );
    }

    // Ownership check
    const existing = getEnquiryById(id);
    if (!existing || existing.businessId !== auth.businessId) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'You are not authorized to manage this enquiry.' },
        { status: 403 }
      );
    }

    const updated = updateEnquiryStatus(
      id,
      auth.businessId!,
      status,
      responseNotes !== undefined ? String(responseNotes).trim() : undefined
    );

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Enquiry status updated successfully.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'INVALID_PAYLOAD', message: 'Failed to update enquiry.' },
      { status: 400 }
    );
  }
}
