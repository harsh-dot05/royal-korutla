import { NextResponse } from 'next/server';
import { requireBusinessOwnerApi } from '@/lib/authServer';
import {
  getOffersByBusinessId,
  createOffer,
  updateOffer,
  deleteOffer,
  getOfferById,
  getBusinessProfile,
} from '@/lib/businessDataStore';

export async function GET(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  const offers = getOffersByBusinessId(auth.businessId!);
  return NextResponse.json({
    success: true,
    data: offers,
  });
}

export async function POST(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json();
    const { title, discount, code, startDate, expiry, terms, isActive, image, tag } = body;

    if (!title || !discount || !expiry) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_FIELDS',
          message: 'Offer title, discount percentage/amount, and expiry date are required.',
        },
        { status: 400 }
      );
    }

    const business = getBusinessProfile(auth.businessId!);
    const businessName = business?.name || 'Local Korutla Business';

    const newOffer = createOffer(auth.businessId!, businessName, {
      title: String(title).trim(),
      discount: String(discount).trim(),
      code: code ? String(code).trim().toUpperCase() : undefined,
      startDate: startDate ? String(startDate) : new Date().toISOString().split('T')[0],
      expiry: String(expiry),
      terms: terms ? String(terms).trim() : undefined,
      isActive: isActive !== false,
      image: String(
        image ||
          business?.image ||
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'
      ).trim(),
      tag: tag ? String(tag).trim() : 'EXCLUSIVE OFFER',
    });

    return NextResponse.json({
      success: true,
      data: newOffer,
      message: 'Offer published successfully.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'INVALID_PAYLOAD', message: 'Failed to create offer.' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'MISSING_ID', message: 'Offer ID is required.' },
        { status: 400 }
      );
    }

    // Server-side ownership verification
    const existing = getOfferById(id);
    if (!existing || existing.businessId !== auth.businessId) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'You are not authorized to edit this offer.' },
        { status: 403 }
      );
    }

    const cleanUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) cleanUpdates.title = String(updates.title).trim();
    if (updates.discount !== undefined) cleanUpdates.discount = String(updates.discount).trim();
    if (updates.code !== undefined) cleanUpdates.code = String(updates.code).trim().toUpperCase();
    if (updates.startDate !== undefined) cleanUpdates.startDate = String(updates.startDate);
    if (updates.expiry !== undefined) cleanUpdates.expiry = String(updates.expiry);
    if (updates.terms !== undefined) cleanUpdates.terms = String(updates.terms).trim();
    if (updates.isActive !== undefined) cleanUpdates.isActive = Boolean(updates.isActive);
    if (updates.image !== undefined) cleanUpdates.image = String(updates.image).trim();
    if (updates.tag !== undefined) cleanUpdates.tag = String(updates.tag).trim();

    const updated = updateOffer(id, auth.businessId!, cleanUpdates);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Offer updated successfully.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'INVALID_PAYLOAD', message: 'Failed to update offer.' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'MISSING_ID', message: 'Offer ID is required.' },
        { status: 400 }
      );
    }

    // Ownership check
    const existing = getOfferById(id);
    if (!existing || existing.businessId !== auth.businessId) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'You are not authorized to delete this offer.' },
        { status: 403 }
      );
    }

    const deleted = deleteOffer(id, auth.businessId!);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'DELETE_FAILED', message: 'Could not delete offer.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Offer deleted successfully.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Failed to delete offer.' },
      { status: 500 }
    );
  }
}
