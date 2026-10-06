import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/authServer';
import {
  getPointsSummary,
  getPointTransactions,
  getRewardVouchers,
  addPointTransaction,
  addRewardVoucher,
  deleteRewardVoucher,
} from '@/lib/rewardsStore';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const summary = getPointsSummary();
  const transactions = getPointTransactions();
  const vouchers = getRewardVouchers();

  return NextResponse.json({
    success: true,
    summary,
    transactions,
    vouchers,
  });
}

export async function POST(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'adjust_points') {
      const { amount, type, reason } = body;
      if (!amount || !type || !reason) {
        return NextResponse.json(
          { success: false, message: 'Amount, type, and reason are required' },
          { status: 400 }
        );
      }

      const tx = addPointTransaction(Number(amount), type, reason);
      return NextResponse.json({
        success: true,
        message: `Successfully ${type === 'EARNED' ? 'added' : 'deducted'} ${amount} points!`,
        transaction: tx,
        summary: getPointsSummary(),
      });
    }

    if (action === 'add_voucher') {
      const { title, businessName, pointsCost, valueDiscount, code, expiry, image } = body;
      if (!title || !businessName || !pointsCost || !valueDiscount || !code) {
        return NextResponse.json(
          { success: false, message: 'Missing required voucher fields' },
          { status: 400 }
        );
      }

      const voucher = addRewardVoucher({
        title,
        businessName,
        pointsCost: Number(pointsCost),
        valueDiscount,
        code,
        expiry: expiry || '30 Days from Claim',
        image: image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully added new reward voucher!',
        voucher,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action specified' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process admin rewards request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Voucher ID is required' },
      { status: 400 }
    );
  }

  const deleted = deleteRewardVoucher(id);
  if (!deleted) {
    return NextResponse.json(
      { success: false, message: 'Voucher not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Reward voucher removed successfully',
  });
}
