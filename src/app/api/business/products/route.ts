import { NextResponse } from 'next/server';
import { requireBusinessOwnerApi } from '@/lib/authServer';
import {
  getProductsByBusinessId,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from '@/lib/businessDataStore';

export async function GET(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  const products = getProductsByBusinessId(auth.businessId!);
  return NextResponse.json({
    success: true,
    data: products,
  });
}

export async function POST(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json();
    const { name, description, price, priceDisplay, isAvailable, category, image, isService, isVeg } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_FIELDS',
          message: 'Item name, price, and category are required.',
        },
        { status: 400 }
      );
    }

    const newProduct = createProduct(auth.businessId!, {
      name: String(name).trim(),
      description: String(description || '').trim(),
      price: Number(price) || 0,
      priceDisplay: priceDisplay ? String(priceDisplay).trim() : `₹${price}`,
      isAvailable: isAvailable !== false,
      category: String(category).trim(),
      image: String(
        image ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
      ).trim(),
      isService: Boolean(isService),
      isVeg: Boolean(isVeg),
    });

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product or service added successfully.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'INVALID_PAYLOAD', message: 'Failed to create product.' },
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
        { success: false, error: 'MISSING_ID', message: 'Product ID is required.' },
        { status: 400 }
      );
    }

    // Ownership check on server
    const existing = getProductById(id);
    if (!existing || existing.businessId !== auth.businessId) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'You are not authorized to modify this item.' },
        { status: 403 }
      );
    }

    const cleanUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) cleanUpdates.name = String(updates.name).trim();
    if (updates.description !== undefined) cleanUpdates.description = String(updates.description).trim();
    if (updates.price !== undefined) cleanUpdates.price = Number(updates.price) || 0;
    if (updates.priceDisplay !== undefined) cleanUpdates.priceDisplay = String(updates.priceDisplay).trim();
    if (updates.isAvailable !== undefined) cleanUpdates.isAvailable = Boolean(updates.isAvailable);
    if (updates.category !== undefined) cleanUpdates.category = String(updates.category).trim();
    if (updates.image !== undefined) cleanUpdates.image = String(updates.image).trim();
    if (updates.isService !== undefined) cleanUpdates.isService = Boolean(updates.isService);
    if (updates.isVeg !== undefined) cleanUpdates.isVeg = Boolean(updates.isVeg);

    const updated = updateProduct(id, auth.businessId!, cleanUpdates);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Product or service updated successfully.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'INVALID_PAYLOAD', message: 'Failed to update product.' },
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
        { success: false, error: 'MISSING_ID', message: 'Product ID is required.' },
        { status: 400 }
      );
    }

    // Ownership verification
    const existing = getProductById(id);
    if (!existing || existing.businessId !== auth.businessId) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'You are not authorized to delete this item.' },
        { status: 403 }
      );
    }

    const deleted = deleteProduct(id, auth.businessId!);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'DELETE_FAILED', message: 'Could not delete product.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Failed to delete product.' },
      { status: 500 }
    );
  }
}
