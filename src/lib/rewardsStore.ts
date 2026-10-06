import { RoyalPointTransaction, RewardVoucher } from '@/types';
import { REWARD_VOUCHERS as INITIAL_VOUCHERS, INITIAL_ROYAL_POINTS_TRANSACTIONS } from '@/data/mockData';

// Normalized initial transactions complying with rule: 1,000 Pts welcome bonus
const DEFAULT_TRANSACTIONS: RoyalPointTransaction[] = [
  {
    id: 'rpt-welcome-1000',
    amount: 1000,
    type: 'EARNED',
    reason: 'Welcome bonus for joining Royal Korutla',
    timestamp: 'Today',
  },
  {
    id: 'rpt-order-250',
    amount: 250,
    type: 'EARNED',
    reason: 'Order reward — Royal Paradise Restaurant',
    timestamp: '2 days ago',
  },
  {
    id: 'rpt-review-50',
    amount: 50,
    type: 'EARNED',
    reason: 'Verified business review posted',
    timestamp: '3 days ago',
  },
  {
    id: 'rpt-redeem-500',
    amount: 500,
    type: 'REDEEMED',
    reason: 'Reward redemption — Discount Voucher #RKROYAL100',
    timestamp: '1 week ago',
  },
];

let pointTransactionsStore: RoyalPointTransaction[] = [...DEFAULT_TRANSACTIONS];
let rewardVouchersStore: RewardVoucher[] = [...INITIAL_VOUCHERS];

/**
 * Calculate current points balance
 */
export function getPointsBalance(): number {
  return pointTransactionsStore.reduce((sum, tx) => {
    return tx.type === 'EARNED' ? sum + tx.amount : sum - tx.amount;
  }, 0);
}

/**
 * Get equivalent rupee value (1,000 Pts = ₹10 => 1 Pts = ₹0.01)
 */
export function getEquivalentRupeeValue(points: number): string {
  const rupees = points / 100;
  return rupees.toFixed(2);
}

/**
 * Get all point transactions
 */
export function getPointTransactions(): RoyalPointTransaction[] {
  return [...pointTransactionsStore];
}

/**
 * Get earned and spent totals
 */
export function getPointsSummary() {
  const earned = pointTransactionsStore
    .filter((tx) => tx.type === 'EARNED')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const spent = pointTransactionsStore
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
 * Add a point transaction (manual admin adjustment or system event)
 */
export function addPointTransaction(
  amount: number,
  type: 'EARNED' | 'REDEEMED',
  reason: string
): RoyalPointTransaction {
  const newTx: RoyalPointTransaction = {
    id: `rpt-${Date.now()}`,
    amount,
    type,
    reason,
    timestamp: 'Just now',
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
export function claimVoucherReward(voucherId: string): {
  success: boolean;
  message: string;
  code?: string;
  newBalance?: number;
} {
  const voucher = rewardVouchersStore.find((v) => v.id === voucherId);
  if (!voucher) {
    return { success: false, message: 'Voucher not found' };
  }

  const currentBalance = getPointsBalance();
  if (currentBalance < voucher.pointsCost) {
    return {
      success: false,
      message: `Insufficient Royal Points. You need ${voucher.pointsCost} Points but have ${currentBalance} Points.`,
    };
  }

  addPointTransaction(
    voucher.pointsCost,
    'REDEEMED',
    `Claimed reward voucher "${voucher.title}" (#${voucher.code})`
  );

  return {
    success: true,
    message: `Successfully claimed ${voucher.title}!`,
    code: voucher.code,
    newBalance: getPointsBalance(),
  };
}
