import { NextResponse } from 'next/server';
import {
  getPointsSummary,
  getPointTransactions,
  getRewardVouchers,
  claimVoucherReward,
} from '@/lib/rewardsStore';

export async function GET() {
  try {
    const summary = getPointsSummary();
    const transactions = getPointTransactions();
    const vouchers = getRewardVouchers();

    return NextResponse.json({
      success: true,
      summary,
      transactions,
      vouchers,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch Royal Points data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { voucherId } = body;

    if (!voucherId) {
      return NextResponse.json(
        { success: false, message: 'Voucher ID is required' },
        { status: 400 }
      );
    }

    const result = claimVoucherReward(voucherId);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to claim reward voucher' },
      { status: 500 }
    );
  }
}
