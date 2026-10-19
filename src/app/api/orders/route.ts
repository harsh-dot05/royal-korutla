import { NextResponse } from 'next/server';
import { recordOrder } from '@/lib/businessDataStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newOrder = recordOrder({
      businessId: body.businessId || 'biz-1',
      businessName: body.businessName || 'Royal Paradise Multi-Cuisine Restaurant',
      customerName: body.customerName || 'Guest Customer',
      customerPhone: body.customerPhone || '+91 99632 61741',
      deliveryAddress: body.deliveryAddress || 'Korutla Town',
      landmark: body.landmark,
      notes: body.notes,
      items: body.items || [],
      totalAmount: Number(body.totalAmount) || 0,
      status: 'PENDING',
    });

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: 'Order logged successfully',
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process order log',
        error: { code: 'INVALID_PAYLOAD' },
      },
      { status: 400 }
    );
  }
}
