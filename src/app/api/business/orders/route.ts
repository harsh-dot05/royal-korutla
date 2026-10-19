import { NextResponse } from 'next/server';
import { requireBusinessOwnerApi } from '@/lib/authServer';
import {
  getOrdersByBusinessId,
  updateOrderStatus,
  getOrderById,
} from '@/lib/businessDataStore';

export async function GET(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  const orders = getOrdersByBusinessId(auth.businessId!);
  return NextResponse.json({
    success: true,
    data: orders,
  });
}

export async function PATCH(request: Request) {
  const auth = requireBusinessOwnerApi(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'MISSING_FIELDS', message: 'Order ID and status are required.' },
        { status: 400 }
      );
    }

    // Ownership check
    const existing = getOrderById(id);
    if (!existing || existing.businessId !== auth.businessId) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'You are not authorized to update this order.' },
        { status: 403 }
      );
    }

    const updated = updateOrderStatus(id, auth.businessId!, status);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Order status updated successfully.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'INVALID_PAYLOAD', message: 'Failed to update order status.' },
      { status: 400 }
    );
  }
}
