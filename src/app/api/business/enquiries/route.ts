import { NextResponse } from 'next/server';
import { requireBusinessOwnerApi } from '@/lib/authServer';
import {
  getEnquiriesByBusinessId,
  updateEnquiryStatus,
  getEnquiryById,
  createEnquiry,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessId,
      businessName,
      customerName,
      customerPhone,
      customerEmail,
      subject,
      serviceOrProduct,
      message,
    } = body;

    if (!businessId || !customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, error: 'MISSING_FIELDS', message: 'Business ID, your name and phone number are required.' },
        { status: 400 }
      );
    }

    const enquiry = createEnquiry(businessId, {
      businessName: businessName || 'Local Business',
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      customerEmail: customerEmail ? String(customerEmail).trim() : undefined,
      subject: subject || serviceOrProduct || 'General Enquiry',
      message: message ? String(message).trim() : 'Customer requested contact via Royal Korutla.',
    });

    return NextResponse.json({
      success: true,
      data: enquiry,
      message: 'Enquiry submitted successfully to the merchant.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Failed to submit enquiry.' },
      { status: 500 }
    );
  }
}

