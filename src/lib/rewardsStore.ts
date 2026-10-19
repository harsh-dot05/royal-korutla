import {
  RoyalPointTransaction,
  RewardVoucher,
  ReferralRecord,
  ConfigurableRewardBenefit,
  PointTransactionCategory,
} from '@/types';
import { REWARD_VOUCHERS as INITIAL_VOUCHERS } from '@/data/mockData';

// Demo current customer account (Srinivas Goud)
export const DEMO_USER = {
  id: 'usr-3',
  name: 'Srinivas Goud',
  email: 'srinivas.korutla@gmail.com',
  phone: '+91 94401 88776',
};

// Initial auditable transactions ledger complying with strict rule:
// 1,000 Pts welcome bonus, 500 Pts referral reward, order activity, and voucher redemption
const DEFAULT_TRANSACTIONS: RoyalPointTransaction[] = [
  {
    id: 'rpt-welcome-1000',
    userId: DEMO_USER.id,
    userEmail: DEMO_USER.email,
    amount: 1000,
    type: 'EARNED',
    category: 'SIGNUP',
    reason: 'Welcome bonus for joining Royal Korutla',
    timestamp: '2026-03-05 10:00 AM',
    referenceId: 'ACC-NEW-USER',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'rpt-ref-inviter-500',
    userId: DEMO_USER.id,
    userEmail: DEMO_USER.email,
    amount: 500,
    type: 'EARNED',
    category: 'REFERRAL',
    reason: 'Referral reward — Invited Ramesh Kumar completed first order',
    timestamp: '2026-03-15 02:30 PM',
    referenceId: 'ref-ramesh-01',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'rpt-order-250',
    userId: DEMO_USER.id,
    userEmail: DEMO_USER.email,
    amount: 250,
    type: 'EARNED',
    category: 'ACTIVITY',
    reason: 'Order reward — Royal Paradise Restaurant order #RK-8831',
    timestamp: '2026-04-01 08:15 PM',
    referenceId: 'ORD-RK-8831',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'rpt-review-50',
    userId: DEMO_USER.id,
    userEmail: DEMO_USER.email,
    amount: 50,
    type: 'EARNED',
    category: 'ACTIVITY',
    reason: 'Verified business review posted for Sri Laxmi Textiles',
    timestamp: '2026-04-05 11:45 AM',
    referenceId: 'REV-LAXMI-01',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'rpt-redeem-500',
    userId: DEMO_USER.id,
    userEmail: DEMO_USER.email,
    amount: 500,
    type: 'REDEEMED',
    category: 'REDEMPTION',
    reason: 'Reward redemption — Discount Voucher #RKROYAL100',
    timestamp: '2026-04-10 06:20 PM',
    referenceId: 'rv-1',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

// Initial referral records
const DEFAULT_REFERRALS: ReferralRecord[] = [
  {
    id: 'ref-ramesh-01',
    inviterUserId: DEMO_USER.id,
    inviterName: DEMO_USER.name,
    inviterEmail: DEMO_USER.email,
    invitedUserId: 'usr-5',
    invitedName: 'Ramesh Kumar',
    invitedEmail: 'ramesh.korutla@gmail.com',
    invitedPhone: '+91 98480 33445',
    referralCode: 'RK-SRINI-9440',
    status: 'REWARDED',
    pointsAwarded: 500,
    createdAt: new Date(Date.now() - 22 * 86400000).toISOString(),
    qualifiedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'ref-venkat-02',
    inviterUserId: DEMO_USER.id,
    inviterName: DEMO_USER.name,
    inviterEmail: DEMO_USER.email,
    invitedUserId: 'usr-6',
    invitedName: 'Venkatesh M',
    invitedEmail: 'venkat.m@gmail.com',
    invitedPhone: '+91 94409 66778',
    referralCode: 'RK-SRINI-9440',
    status: 'PENDING_QUALIFYING',
    pointsAwarded: 0,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'ref-suspicious-03',
    inviterUserId: DEMO_USER.id,
    inviterName: DEMO_USER.name,
    inviterEmail: DEMO_USER.email,
    invitedUserId: 'usr-99',
    invitedName: 'Self Referrer Test',
    invitedEmail: 'srinivas.alt@gmail.com',
    invitedPhone: '+91 94401 88776', // Same phone!
    referralCode: 'RK-SRINI-9440',
    status: 'FLAGGED_ABUSE',
    pointsAwarded: 0,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    flagReason: 'Duplicate phone number and device identifier detected (self-referral prevention rule).',
  },
];

// 5,000-Point Configurable Delivery Benefit
const DEFAULT_CONFIGURED_BENEFIT: ConfigurableRewardBenefit = {
  id: 'benefit-free-delivery-5000',
  title: '30-Day Royal Free Town Delivery Pass',
  description:
    'Enjoy unlimited zero-delivery fee on all verified restaurant food, fresh groceries, and local retail orders delivered within Korutla Town.',
  pointsCost: 5000,
  isActive: true,
  minOrderValue: 199,
  validityDays: 30,
  eligibilityRules: [
    'Available to all registered Royal Korutla users with at least 5,000 points.',
    'Applicable for home deliveries across Korutla municipality (Wards 1 to 33).',
    'Minimum cart order value of ₹199 to activate free delivery discount at checkout.',
    'Valid for 30 consecutive calendar days from moment of redemption.',
  ],
  termsAndConditions:
    'Pass applies to platform delivery fees; surge charges during extreme weather or external merchant packaging fees are excluded. Strictly non-transferable.',
  updatedAt: new Date().toISOString(),
};

// In-Memory Persistent Stores
let pointTransactionsStore: RoyalPointTransaction[] = [...DEFAULT_TRANSACTIONS];
let rewardVouchersStore: RewardVoucher[] = [...INITIAL_VOUCHERS];
let referralRecordsStore: ReferralRecord[] = [...DEFAULT_REFERRALS];
let configuredBenefitStore: ConfigurableRewardBenefit = { ...DEFAULT_CONFIGURED_BENEFIT };

// Sets to enforce strict constraints against duplicate rewards
const awardedSignupUserIds = new Set<string>([DEMO_USER.id]);
const awardedReferralPairs = new Set<string>([`${DEMO_USER.id}:usr-5`]);

/**
 * Calculate current points balance from server-side ledger
 */
export function getPointsBalance(userId?: string): number {
  const userTxs = userId
    ? pointTransactionsStore.filter((tx) => !tx.userId || tx.userId === userId)
    : pointTransactionsStore;

  return userTxs.reduce((sum, tx) => {
    return tx.type === 'EARNED' ? sum + tx.amount : sum - tx.amount;
  }, 0);
}

/**
 * Get equivalent rupee value: 1,000 Pts = ₹10 => 1 Pt = ₹0.01
 */
export function getEquivalentRupeeValue(points: number): string {
  const rupees = points / 100;
  return rupees.toFixed(2);
}

/**
 * Get all point transactions (sorted newest first)
 */
export function getPointTransactions(userId?: string): RoyalPointTransaction[] {
  const txs = userId
    ? pointTransactionsStore.filter((tx) => !tx.userId || tx.userId === userId)
    : pointTransactionsStore;

  return [...txs].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
}

/**
 * Get points ledger summary
 */
export function getPointsSummary(userId?: string) {
  const userTxs = userId
    ? pointTransactionsStore.filter((tx) => !tx.userId || tx.userId === userId)
    : pointTransactionsStore;

  const earned = userTxs
    .filter((tx) => tx.type === 'EARNED')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const spent = userTxs
    .filter((tx) => tx.type === 'REDEEMED')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = earned - spent;

  return {
    balance,
    earned,
    spent,
    equivalentRupees: getEquivalentRupeeValue(balance),
  };
}

/**
 * Generate a deterministic or unique referral code for a user
 */
export function getUserReferralCode(user: { id: string; name?: string; phone?: string }): string {
  if (user.id === DEMO_USER.id) {
    return 'RK-SRINI-9440';
  }
  const cleanName = (user.name || 'USER')
    .split(' ')[0]
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 5);
  const suffix = (user.phone || user.id).replace(/[^0-9]/g, '').slice(-4) || '2026';
  return `RK-${cleanName}-${suffix}`;
}

/**
 * Award Signup bonus (1,000 Pts) - Prevents awarding twice
 */
export function awardSignupBonus(user: {
  id: string;
  name: string;
  email: string;
  phone?: string;
}): { success: boolean; transaction?: RoyalPointTransaction; message: string } {
  if (awardedSignupUserIds.has(user.id)) {
    return {
      success: false,
      message: 'Signup bonus has already been awarded to this account.',
    };
  }

  // Check if any transaction exists with SIGNUP category for this user
  const alreadyAwarded = pointTransactionsStore.some(
    (tx) => tx.userId === user.id && tx.category === 'SIGNUP'
  );
  if (alreadyAwarded) {
    awardedSignupUserIds.add(user.id);
    return {
      success: false,
      message: 'Signup bonus has already been awarded to this account.',
    };
  }

  const tx: RoyalPointTransaction = {
    id: `rpt-signup-${Date.now()}`,
    userId: user.id,
    userEmail: user.email,
    amount: 1000,
    type: 'EARNED',
    category: 'SIGNUP',
    reason: 'Welcome bonus for joining Royal Korutla (+1,000 Pts)',
    timestamp: new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    referenceId: `SIGNUP-${user.id}`,
    createdAt: new Date().toISOString(),
  };

  pointTransactionsStore = [tx, ...pointTransactionsStore];
  awardedSignupUserIds.add(user.id);

  return {
    success: true,
    transaction: tx,
    message: 'Welcome bonus of 1,000 Royal Points credited successfully!',
  };
}

/**
 * Apply a friend's referral code when inviting or signing up
 */
export function applyReferralCode(
  invitedUser: { id: string; name: string; email: string; phone?: string },
  referralCode: string
): { success: boolean; message: string; referral?: ReferralRecord } {
  const cleanCode = referralCode.trim().toUpperCase();

  // Find inviter by referral code
  let inviter = DEMO_USER;
  if (cleanCode !== 'RK-SRINI-9440') {
    // If not demo code, check known users
    if (cleanCode.includes('SRINI')) {
      inviter = DEMO_USER;
    } else {
      return {
        success: false,
        message: 'Invalid referral code. Please check the code shared by your friend.',
      };
    }
  }

  // PREVENT SELF-REFERRAL
  if (
    invitedUser.id === inviter.id ||
    invitedUser.email.toLowerCase() === inviter.email.toLowerCase() ||
    (invitedUser.phone && inviter.phone && invitedUser.phone.replace(/[^0-9]/g, '') === inviter.phone.replace(/[^0-9]/g, ''))
  ) {
    return {
      success: false,
      message: 'Self-referral is strictly disallowed by Royal Korutla security rules.',
    };
  }

  // PREVENT DUPLICATE REFERRAL FOR SAME USER
  const existingReferral = referralRecordsStore.find(
    (r) => r.invitedUserId === invitedUser.id || r.invitedEmail.toLowerCase() === invitedUser.email.toLowerCase()
  );
  if (existingReferral) {
    return {
      success: false,
      message: 'You have already applied a referral invitation code on your account.',
    };
  }

  const newReferral: ReferralRecord = {
    id: `ref-${Date.now()}`,
    inviterUserId: inviter.id,
    inviterName: inviter.name,
    inviterEmail: inviter.email,
    invitedUserId: invitedUser.id,
    invitedName: invitedUser.name,
    invitedEmail: invitedUser.email,
    invitedPhone: invitedUser.phone,
    referralCode: cleanCode,
    status: 'PENDING_QUALIFYING',
    pointsAwarded: 0,
    createdAt: new Date().toISOString(),
  };

  referralRecordsStore = [newReferral, ...referralRecordsStore];

  return {
    success: true,
    message: `Referral code "${cleanCode}" applied! Complete your first verified order to unlock 500 Royal Points for both you and ${inviter.name}.`,
    referral: newReferral,
  };
}

/**
 * Qualify referral and award 500 points to inviter and 500 points to invited user
 */
export function qualifyReferral(
  referralId: string,
  orderOrActionId: string
): { success: boolean; message: string; referral?: ReferralRecord } {
  const referral = referralRecordsStore.find((r) => r.id === referralId);
  if (!referral) {
    return { success: false, message: 'Referral record not found.' };
  }

  if (referral.status === 'REWARDED') {
    return { success: false, message: 'This referral has already been rewarded.' };
  }

  if (referral.status === 'FLAGGED_ABUSE') {
    return {
      success: false,
      message: `Referral flagged as suspicious: ${referral.flagReason || 'Policy violation'}`,
    };
  }

  const pairKey = `${referral.inviterUserId}:${referral.invitedUserId}`;
  if (awardedReferralPairs.has(pairKey)) {
    return { success: false, message: 'Points already awarded for this inviter and invited user pair.' };
  }

  const nowFormatted = new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const nowIso = new Date().toISOString();

  // 1. Award 500 points to inviter
  const inviterTx: RoyalPointTransaction = {
    id: `rpt-ref-inviter-${Date.now()}`,
    userId: referral.inviterUserId,
    userEmail: referral.inviterEmail,
    amount: 500,
    type: 'EARNED',
    category: 'REFERRAL',
    reason: `Referral bonus — Invited friend ${referral.invitedName} completed qualifying order (#${orderOrActionId})`,
    timestamp: nowFormatted,
    referenceId: referral.id,
    createdAt: nowIso,
  };

  // 2. Award 500 points to invited user
  const invitedTx: RoyalPointTransaction = {
    id: `rpt-ref-invited-${Date.now()}`,
    userId: referral.invitedUserId,
    userEmail: referral.invitedEmail,
    amount: 500,
    type: 'EARNED',
    category: 'REFERRAL',
    reason: `Referral welcome reward — Applied code ${referral.referralCode} and verified first order`,
    timestamp: nowFormatted,
    referenceId: referral.id,
    createdAt: nowIso,
  };

  pointTransactionsStore = [inviterTx, invitedTx, ...pointTransactionsStore];
  awardedReferralPairs.add(pairKey);

  // Update referral status
  referral.status = 'REWARDED';
  referral.pointsAwarded = 500;
  referral.qualifiedAt = nowIso;

  return {
    success: true,
    message: `Qualifying referral approved! 500 Royal Points awarded to ${referral.inviterName} and 500 Royal Points to ${referral.invitedName}.`,
    referral,
  };
}

/**
 * Flag suspicious referral (Admin)
 */
export function flagSuspiciousReferral(referralId: string, reason: string): boolean {
  const referral = referralRecordsStore.find((r) => r.id === referralId);
  if (!referral) return false;
  referral.status = 'FLAGGED_ABUSE';
  referral.flagReason = reason;
  return true;
}

/**
 * Get referrals list for a user
 */
export function getUserReferrals(userId: string) {
  const invitedList = referralRecordsStore.filter((r) => r.inviterUserId === userId);
  const totalInvited = invitedList.length;
  const rewarded = invitedList.filter((r) => r.status === 'REWARDED').length;
  const pending = invitedList.filter((r) => r.status === 'PENDING_QUALIFYING').length;
  const totalEarnedPoints = rewarded * 500;

  return {
    referrals: invitedList,
    totalInvited,
    rewarded,
    pending,
    totalEarnedPoints,
  };
}

/**
 * Get all referrals (Admin Audit)
 */
export function getAllReferrals(): ReferralRecord[] {
  return [...referralRecordsStore];
}

/**
 * Get configurable 5,000-point benefit
 */
export function getConfiguredBenefit(): ConfigurableRewardBenefit {
  return { ...configuredBenefitStore };
}

/**
 * Update configurable 5,000-point benefit (Admin)
 */
export function updateConfiguredBenefit(
  updates: Partial<ConfigurableRewardBenefit>
): ConfigurableRewardBenefit {
  configuredBenefitStore = {
    ...configuredBenefitStore,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return { ...configuredBenefitStore };
}

/**
 * Claim 5,000-point Free Delivery Benefit
 */
export function claimConfiguredBenefit(userId: string): {
  success: boolean;
  message: string;
  newBalance?: number;
} {
  const benefit = configuredBenefitStore;
  if (!benefit.isActive) {
    return { success: false, message: 'This reward benefit is currently unavailable.' };
  }

  const currentBalance = getPointsBalance(userId);
  if (currentBalance < benefit.pointsCost) {
    return {
      success: false,
      message: `Insufficient Royal Points. You need ${benefit.pointsCost.toLocaleString()} Points but have ${currentBalance.toLocaleString()} Points.`,
    };
  }

  const tx: RoyalPointTransaction = {
    id: `rpt-redeem-benefit-${Date.now()}`,
    userId,
    amount: benefit.pointsCost,
    type: 'REDEEMED',
    category: 'REDEMPTION',
    reason: `Claimed benefit: "${benefit.title}" (${benefit.validityDays} Days Free Delivery)`,
    timestamp: new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    referenceId: benefit.id,
    createdAt: new Date().toISOString(),
  };

  pointTransactionsStore = [tx, ...pointTransactionsStore];

  return {
    success: true,
    message: `Congratulations! You have activated "${benefit.title}". Enjoy free town delivery on qualifying orders!`,
    newBalance: getPointsBalance(userId),
  };
}

/**
 * Add point transaction (Admin manual adjustment or reversal with mandatory recorded reason)
 */
export function addPointTransaction(
  amount: number,
  type: 'EARNED' | 'REDEEMED',
  reason: string,
  options?: {
    userId?: string;
    userEmail?: string;
    category?: PointTransactionCategory;
    referenceId?: string;
  }
): RoyalPointTransaction {
  const newTx: RoyalPointTransaction = {
    id: `rpt-${Date.now()}`,
    userId: options?.userId || DEMO_USER.id,
    userEmail: options?.userEmail || DEMO_USER.email,
    amount: Math.abs(amount),
    type,
    category: options?.category || 'ADJUSTMENT',
    reason: reason.trim(),
    timestamp: new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    referenceId: options?.referenceId,
    createdAt: new Date().toISOString(),
  };

  pointTransactionsStore = [newTx, ...pointTransactionsStore];
  return newTx;
}

/**
 * Get all reward vouchers
 */
export function getRewardVouchers(): RewardVoucher[] {
  return [...rewardVouchersStore];
}

/**
 * Add new reward voucher (Admin)
 */
export function addRewardVoucher(voucher: Omit<RewardVoucher, 'id'>): RewardVoucher {
  const newVoucher: RewardVoucher = {
    ...voucher,
    id: `rv-${Date.now()}`,
  };

  rewardVouchersStore = [newVoucher, ...rewardVouchersStore];
  return newVoucher;
}

/**
 * Delete reward voucher (Admin)
 */
export function deleteRewardVoucher(id: string): boolean {
  const initialLength = rewardVouchersStore.length;
  rewardVouchersStore = rewardVouchersStore.filter((v) => v.id !== id);
  return rewardVouchersStore.length < initialLength;
}

/**
 * Claim voucher reward by redeeming points
 */
export function claimVoucherReward(
  voucherId: string,
  userId?: string
): {
  success: boolean;
  message: string;
  code?: string;
  newBalance?: number;
} {
  const voucher = rewardVouchersStore.find((v) => v.id === voucherId);
  if (!voucher) {
    return { success: false, message: 'Voucher not found' };
  }

  const currentBalance = getPointsBalance(userId);
  if (currentBalance < voucher.pointsCost) {
    return {
      success: false,
      message: `Insufficient Royal Points. You need ${voucher.pointsCost} Points but have ${currentBalance} Points.`,
    };
  }

  addPointTransaction(
    voucher.pointsCost,
    'REDEEMED',
    `Claimed store discount voucher "${voucher.title}" (#${voucher.code})`,
    {
      userId: userId || DEMO_USER.id,
      category: 'REDEMPTION',
      referenceId: voucher.id,
    }
  );

  return {
    success: true,
    message: `Successfully claimed ${voucher.title}!`,
    code: voucher.code,
    newBalance: getPointsBalance(userId),
  };
}
