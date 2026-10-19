import { NextResponse } from 'next/server';
import { requireBusinessOwnerApi } from '@/lib/authServer';
import { getBusinessProfile, updateBusinessProfile } from '@/lib/businessDataStore';

export async function GET(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  const profile = getBusinessProfile(auth.businessId!);
  if (!profile) {
    return NextResponse.json(
      { success: false, error: 'NOT_FOUND', message: 'Business not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: profile,
  });
}

export async function PUT(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json();

    // Whitelist editable fields to prevent privilege escalation or tampering
    const allowedUpdates = {
      name: body.name ? String(body.name).trim() : undefined,
      categorySlug: body.categorySlug,
      subCategory: body.subCategory ? String(body.subCategory).trim() : undefined,
      description: body.description !== undefined ? String(body.description).trim() : undefined,
      address: body.address ? String(body.address).trim() : undefined,
      landmark: body.landmark !== undefined ? String(body.landmark).trim() : undefined,
      phone: body.phone ? String(body.phone).trim() : undefined,
      whatsapp: body.whatsapp !== undefined ? String(body.whatsapp).trim() : undefined,
      timing: body.timing ? String(body.timing).trim() : undefined,
      image: body.image ? String(body.image).trim() : undefined,
      galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : undefined,
      priceRange: body.priceRange !== undefined ? String(body.priceRange).trim() : undefined,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      ownerName: body.ownerName !== undefined ? String(body.ownerName).trim() : undefined,
    };

    // Remove undefined keys
    Object.keys(allowedUpdates).forEach(
      (key) => (allowedUpdates as Record<string, unknown>)[key] === undefined && delete (allowedUpdates as Record<string, unknown>)[key]
    );

    const updated = updateBusinessProfile(auth.businessId!, allowedUpdates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND', message: 'Business profile not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Business profile updated successfully.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'INVALID_PAYLOAD', message: 'Failed to update business profile.' },
      { status: 400 }
    );
  }
}
