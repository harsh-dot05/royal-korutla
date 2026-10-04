'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { REWARD_VOUCHERS, INITIAL_ROYAL_POINTS_TRANSACTIONS } from '@/data/mockData';
import { RoyalPointTransaction } from '@/types';
import { Crown, Sparkles, Gift, History, Share2 } from 'lucide-react';

export default function RewardsPage() {
  const [pointsBalance, setPointsBalance] = useState(150);
  const [transactions, setTransactions] = useState<RoyalPointTransaction[]>(INITIAL_ROYAL_POINTS_TRANSACTIONS);
  const [claimedCodes, setClaimedCodes] = useState<{ [id: string]: string }>({});

  const handleClaimVoucher = (voucherId: string, cost: number, code: string) => {
    if (pointsBalance < cost) {
      alert(`You need ${cost} Royal Points to claim this reward! Write reviews or share referral link to earn more points.`);
      return;
    }

    setPointsBalance((prev) => prev - cost);
    setClaimedCodes((prev) => ({ ...prev, [voucherId]: code }));
    setTransactions((prev) => [
      {
        id: `rpt-${Date.now()}`,
        amount: cost,
        type: 'REDEEMED',
        reason: `Claimed voucher reward #${code}`,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Points Banner */}
        <div className="rounded-2xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                <Crown className="w-4 h-4 text-blue-600" />
                <span>Royal Points Loyalty Ledger</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Royal Points Rewards
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg font-normal">
                Earn Royal Points every time you write store reviews, place food orders, or refer friends in Korutla. Redeem points for store discounts!
              </p>
            </div>

            {/* Balance Badge */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center w-full md:w-auto shadow-xs">
              <span className="text-xs font-bold text-slate-600 block mb-1">Your Royal Points Balance</span>
              <div className="flex items-center justify-center gap-2 text-4xl font-black text-blue-600">
                <Crown className="w-8 h-8 text-blue-600" />
                <span>{pointsBalance}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold block mt-1">1 Point = ₹0.50 Discount Value</span>
            </div>
          </div>
        </div>

        {/* Earn Points Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-xl p-5 border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 w-fit">
              <Crown className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Welcome Bonus</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">Earned +100 Royal Points automatically on creating your account.</p>
          </div>

          <div className="rounded-xl p-5 border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Write Business Reviews</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">Earn +50 points for every verified business review you post in Korutla.</p>
          </div>

          <div className="rounded-xl p-5 border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 w-fit">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Invite Local Friends</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">Earn +100 points whenever a Korutla friend joins using your referral link.</p>
          </div>
        </div>

        {/* Available Vouchers Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-600" />
            <span>Redeem Points for Store Vouchers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REWARD_VOUCHERS.map((voucher) => {
              const isClaimed = !!claimedCodes[voucher.id];

              return (
                <div
                  key={voucher.id}
                  className="rounded-xl p-5 border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-36 w-full rounded-lg overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                      <Image src={voucher.image} alt={voucher.title} fill sizes="300px" className="object-cover" />
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-bold shadow-xs">
                        {voucher.valueDiscount}
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">{voucher.businessName}</span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">{voucher.title}</h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Points Cost:</span>
                      <span className="text-blue-600 font-bold flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5" /> {voucher.pointsCost} Points
                      </span>
                    </div>

                    {isClaimed ? (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                        <span className="text-[10px] text-emerald-700 font-bold block">Voucher Code Claimed:</span>
                        <span className="font-mono text-sm font-bold text-slate-900">{claimedCodes[voucher.id]}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaimVoucher(voucher.id, voucher.pointsCost, voucher.code)}
                        className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                      >
                        Redeem Voucher
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Points History Ledger Table */}
        <section className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <History className="w-5 h-5 text-blue-600" />
            <span>Royal Points Ledger History</span>
          </h2>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{tx.reason}</h4>
                  <span className="text-[10px] text-slate-500 font-medium">{tx.timestamp}</span>
                </div>
                <span className={`font-mono font-bold text-sm ${tx.type === 'EARNED' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {tx.type === 'EARNED' ? '+' : '-'}{tx.amount} Pts
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
