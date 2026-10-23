import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/authServer';
import { getAllEnquiries, updateEnquiryStatusAdmin } from '@/lib/businessDataStore';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const enquiries = getAllEnquiries();
  return NextResponse.json({
    success: true,
    data: enquiries,
    message: 'Admin enquiries retrieved successfully.',
  });
}

export async function PATCH(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, status, responseNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'MISSING_FIELDS', message: 'Enquiry ID and status are required.' },
        { status: 400 }
      );
    }

    const updated = updateEnquiryStatusAdmin(id, status, responseNotes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND', message: 'Enquiry not found.' },
        { status: 404 }
      );
    }

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
