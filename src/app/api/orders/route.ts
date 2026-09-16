import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orderId = `RK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        customerName: body.customerName,
        totalAmount: body.totalAmount,
        status: 'WHATSAPP_DISPATCHED',
        createdAt: new Date().toISOString(),
      },
      message: 'Order logged successfully',
    });
  } catch (error) {
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
