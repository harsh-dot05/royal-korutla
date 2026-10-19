import { NextResponse } from 'next/server';
import {
  getPointsSummary,
  getPointTransactions,
  getRewardVouchers,
  claimVoucherReward,
  getConfiguredBenefit,
  claimConfiguredBenefit,
  getUserReferrals,
  getUserReferralCode,
  applyReferralCode,
  awardSignupBonus,
  DEMO_USER,
} from '@/lib/rewardsStore';
import { getSessionFromRequest } from '@/lib/authServer';

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    const activeUser = session || DEMO_USER;

    const summary = getPointsSummary(activeUser.id);
    const transactions = getPointTransactions(activeUser.id);
    const vouchers = getRewardVouchers();
    const configuredBenefit = getConfiguredBenefit();
    const referralData = getUserReferrals(activeUser.id);
    const referralCode = getUserReferralCode(activeUser);

    return NextResponse.json({
      success: true,
      user: {
        id: activeUser.id,
        name: activeUser.name,
        email: activeUser.email,
      },
      summary,
      transactions,
      vouchers,
      configuredBenefit,
      referral: {
        code: referralCode,
        shareUrl: `https://royalkorutla.com/rewards?ref=${referralCode}`,
        totalInvited: referralData.totalInvited,
        rewarded: referralData.rewarded,
        pending: referralData.pending,
        totalEarnedPoints: referralData.totalEarnedPoints,
        history: referralData.referrals,
      },
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
    const session = getSessionFromRequest(request);
    const activeUser = session || DEMO_USER;
    const body = await request.json();
    const { action, voucherId, referralCode } = body;

    // 1. Claim Voucher
    if (action === 'claim_voucher' || voucherId) {
      const vId = voucherId || body.id;
      if (!vId) {
        return NextResponse.json(
          { success: false, message: 'Voucher ID is required' },
          { status: 400 }
        );
      }
      const result = claimVoucherReward(vId, activeUser.id);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    // 2. Claim Configurable 5,000-Point Benefit
    if (action === 'claim_benefit') {
      const result = claimConfiguredBenefit(activeUser.id);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    // 3. Apply Referral Code
    if (action === 'apply_referral') {
      if (!referralCode) {
        return NextResponse.json(
          { success: false, message: 'Referral code is required.' },
          { status: 400 }
        );
      }
      const result = applyReferralCode(
        {
          id: activeUser.id,
          name: activeUser.name,
          email: activeUser.email,
        },
        referralCode
      );
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    // 4. Claim 1,000 Pts Signup Bonus
    if (action === 'claim_signup_bonus') {
      const result = awardSignupBonus({
        id: activeUser.id,
        name: activeUser.name,
        email: activeUser.email,
      });
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid rewards action requested.' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error processing rewards request.' },
      { status: 500 }
    );
  }
}
