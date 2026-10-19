import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/authServer';
import {
  getPointsSummary,
  getPointTransactions,
  getRewardVouchers,
  addPointTransaction,
  addRewardVoucher,
  deleteRewardVoucher,
  getAllReferrals,
  getConfiguredBenefit,
  updateConfiguredBenefit,
  qualifyReferral,
  flagSuspiciousReferral,
} from '@/lib/rewardsStore';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const summary = getPointsSummary();
  const transactions = getPointTransactions();
  const vouchers = getRewardVouchers();
  const referrals = getAllReferrals();
  const configuredBenefit = getConfiguredBenefit();

  return NextResponse.json({
    success: true,
    summary,
    transactions,
    vouchers,
    referrals,
    configuredBenefit,
  });
}

export async function POST(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { action } = body;

    // 1. Manual Points Adjustment / Reversal with Mandatory Reason
    if (action === 'adjust_points') {
      const { amount, type, reason, userId, category } = body;
      if (!amount || !type || !reason || !reason.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: 'Amount, type, and an auditable recorded reason are required for adjustments.',
          },
          { status: 400 }
        );
      }

      const tx = addPointTransaction(Number(amount), type, reason.trim(), {
        userId,
        category: category || 'ADJUSTMENT',
      });

      return NextResponse.json({
        success: true,
        message: `Successfully ${type === 'EARNED' ? 'credited' : 'deducted'} ${amount} points with recorded reason.`,
        transaction: tx,
        summary: getPointsSummary(),
      });
    }

    // 2. Qualify and Reward a Referral (Awards 500 Pts to both)
    if (action === 'qualify_referral') {
      const { referralId, orderId } = body;
      if (!referralId) {
        return NextResponse.json(
          { success: false, message: 'Referral ID is required' },
          { status: 400 }
        );
      }
      const result = qualifyReferral(referralId, orderId || 'VERIFIED-ORDER-01');
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    // 3. Flag a Suspicious Referral (Anti-Abuse)
    if (action === 'flag_referral') {
      const { referralId, reason } = body;
      if (!referralId || !reason || !reason.trim()) {
        return NextResponse.json(
          { success: false, message: 'Referral ID and suspicion reason are required.' },
          { status: 400 }
        );
      }
      const success = flagSuspiciousReferral(referralId, reason.trim());
      return NextResponse.json({
        success,
        message: success ? 'Referral marked as FLAGGED_ABUSE.' : 'Referral not found.',
      });
    }

    // 4. Configure the 5,000-Point Delivery Benefit
    if (action === 'update_benefit') {
      const { title, description, pointsCost, isActive, minOrderValue, validityDays, eligibilityRules, termsAndConditions } = body;
      const updated = updateConfiguredBenefit({
        ...(title && { title }),
        ...(description && { description }),
        ...(pointsCost !== undefined && { pointsCost: Number(pointsCost) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(minOrderValue !== undefined && { minOrderValue: Number(minOrderValue) }),
        ...(validityDays !== undefined && { validityDays: Number(validityDays) }),
        ...(eligibilityRules && { eligibilityRules }),
        ...(termsAndConditions && { termsAndConditions }),
      });

      return NextResponse.json({
        success: true,
        message: 'Reward benefit configuration updated successfully.',
        configuredBenefit: updated,
      });
    }

    // 5. Add Reward Voucher
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
      { success: false, message: 'Invalid admin rewards action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process admin rewards operation' },
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
      { success: false, message: 'Reward voucher ID is required' },
      { status: 400 }
    );
  }

  const success = deleteRewardVoucher(id);
  return NextResponse.json({
    success,
    message: success ? 'Voucher deleted successfully' : 'Voucher not found',
  });
}
