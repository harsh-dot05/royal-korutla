'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoyalPointTransaction, RewardVoucher } from '@/types';
import { Crown, Gift, History, PlusCircle, MinusCircle, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RewardsPage() {
  const [balance, setBalance] = useState(800);
  const [earnedTotal, setEarnedTotal] = useState(1300);
  const [spentTotal, setSpentTotal] = useState(500);
  const [equivalentRupees, setEquivalentRupees] = useState('8.00');
  const [transactions, setTransactions] = useState<RoyalPointTransaction[]>([]);
  const [vouchers, setVouchers] = useState<RewardVoucher[]>([]);
  const [claimedCodes, setClaimedCodes] = useState<{ [id: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchRewardsData = async () => {
    try {
      const res = await fetch('/api/rewards');
      const data = await res.json();
      if (data.success && data.summary) {
        setBalance(data.summary.balance);
        setEarnedTotal(data.summary.earned);
        setSpentTotal(data.summary.spent);
        setEquivalentRupees(data.summary.equivalentRupees);
        setTransactions(data.transactions || []);
        setVouchers(data.vouchers || []);
      }
    } catch (err) {
      console.error('Error loading rewards data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const handleClaimVoucher = async (voucherId: string, cost: number) => {
    if (balance < cost) {
      setAlertMessage({
        type: 'error',
        text: `You need ${cost} Royal Points to claim this reward! You currently have ${balance} Points.`,
      });
      return;
    }

    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId }),
      });

      const data = await res.json();
      if (data.success) {
        setClaimedCodes((prev) => ({ ...prev, [voucherId]: data.code }));
        setAlertMessage({
          type: 'success',
          text: `Voucher claimed successfully! Use code "${data.code}" at checkout.`,
        });
        fetchRewardsData();
      } else {
        setAlertMessage({
          type: 'error',
          text: data.message || 'Failed to claim voucher.',
        });
      }
    } catch (err) {
      setAlertMessage({
        type: 'error',
        text: 'An error occurred while claiming the voucher.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Alert Banner */}
        {alertMessage && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-bold ${
              alertMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {alertMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{alertMessage.text}</span>
            </div>
            <button
              onClick={() => setAlertMessage(null)}
              className="text-slate-500 hover:text-slate-800 underline text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header & Balance Card */}
        <div className="rounded-2xl p-6 sm:p-8 border border-slate-200 bg-slate-50 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold">
                <Crown className="w-4 h-4 text-blue-600" />
                <span>Customer Loyalty Program</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Royal Points
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
                New customer accounts receive 1,000 Royal Points upon signup. Earn points with every verified order or review in Korutla and redeem them for store discount vouchers.
              </p>
            </div>

            {/* Current Balance Box */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center w-full md:w-72 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Current Balance
              </span>
              <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-black text-blue-600">
                <Crown className="w-8 h-8 text-blue-600 shrink-0" />
                <span>{balance.toLocaleString()} Points</span>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1">
                ≈ ₹{equivalentRupees} value
              </p>
              <span className="text-[10px] text-slate-400 font-medium block">
                (1,000 Royal Points = ₹10 equivalent)
              </span>
            </div>
          </div>

          {/* Points Breakdown Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Earned Points</span>
                  <span className="text-sm font-extrabold text-slate-900">+{earnedTotal.toLocaleString()} Pts</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">≈ ₹{(earnedTotal / 100).toFixed(2)}</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                  <MinusCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Spent Points</span>
                  <span className="text-sm font-extrabold text-slate-900">-{spentTotal.toLocaleString()} Pts</span>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600">≈ ₹{(spentTotal / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Earning Rules Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Crown className="w-4 h-4 text-blue-600" />
              <span>Welcome Bonus</span>
            </div>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              +1,000 Royal Points (≈ ₹10.00) automatically credited on new customer account signup.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Order Rewards</span>
            </div>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              Earn Royal Points on food orders and merchant transactions across Korutla town.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Gift className="w-4 h-4 text-blue-600" />
              <span>Store Vouchers</span>
            </div>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              Redeem accumulated points for instant store discounts and shopping vouchers.
            </p>
          </div>
        </div>

        {/* Points History Ledger Section */}
        <section className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <History className="w-5 h-5 text-blue-600" />
            <span>Points History Ledger</span>
          </h2>

          {loading ? (
            <div className="p-6 text-center text-xs text-slate-500 font-medium">
              Loading transactions history...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center space-y-2 border border-dashed border-slate-200 rounded-xl">
              <History className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Transactions Found</h3>
              <p className="text-xs text-slate-500">Your points ledger history will appear here as you earn and redeem points.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {transactions.map((tx) => {
                const isEarned = tx.type === 'EARNED';
                return (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900">{tx.reason}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">{tx.timestamp}</span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-mono font-bold text-sm block ${
                          isEarned ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isEarned ? '+' : '-'}{tx.amount.toLocaleString()} Pts
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        ≈ ₹{(tx.amount / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Available Rewards / Vouchers */}
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-600" />
            <span>Available Reward Vouchers</span>
          </h2>

          {loading ? (
            <div className="p-6 text-center text-xs text-slate-500 font-medium">
              Loading reward vouchers...
            </div>
          ) : vouchers.length === 0 ? (
            <div className="p-8 text-center space-y-2 border border-dashed border-slate-200 rounded-xl bg-white">
              <Gift className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Vouchers Available</h3>
              <p className="text-xs text-slate-500">Check back soon for new local store discount vouchers in Korutla.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vouchers.map((voucher) => {
                const isClaimed = !!claimedCodes[voucher.id];
                const canAfford = balance >= voucher.pointsCost;

                return (
                  <div
                    key={voucher.id}
                    className="rounded-xl p-5 border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-36 w-full rounded-lg overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                        <Image
                          src={voucher.image}
                          alt={voucher.title}
                          fill
                          sizes="300px"
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-bold shadow-xs">
                          {voucher.valueDiscount}
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                        {voucher.businessName}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                        {voucher.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600">Cost:</span>
                        <span className="text-blue-600 font-bold flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5" /> {voucher.pointsCost} Pts
                        </span>
                      </div>

                      {isClaimed ? (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                          <span className="text-[10px] text-emerald-700 font-bold block">
                            Voucher Code Claimed:
                          </span>
                          <span className="font-mono text-sm font-bold text-slate-900">
                            {claimedCodes[voucher.id]}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleClaimVoucher(voucher.id, voucher.pointsCost)}
                          disabled={!canAfford}
                          className={`w-full py-2.5 rounded-lg text-white font-bold text-xs transition-colors shadow-xs ${
                            canAfford
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-slate-300 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Redeem Voucher' : 'Insufficient Points'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
