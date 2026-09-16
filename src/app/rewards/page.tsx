'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { REWARD_VOUCHERS, INITIAL_ROYAL_POINTS_TRANSACTIONS } from '@/data/mockData';
import { RoyalPointTransaction } from '@/types';
import { Crown, Sparkles, Gift, History, Share2, Copy, Check, ArrowUpRight } from 'lucide-react';

export default function RewardsPage() {
  const [pointsBalance, setPointsBalance] = useState(150);
  const [transactions, setTransactions] = useState<RoyalPointTransaction[]>(INITIAL_ROYAL_POINTS_TRANSACTIONS);
  const [copiedReferral, setCopiedReferral] = useState(false);
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

  const copyReferralLink = () => {
    navigator.clipboard.writeText('https://royalkorutla.com/invite?ref=RK9876');
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Points Banner */}
        <div className="rounded-3xl glass-card p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Crown className="w-4 h-4 fill-amber-400" />
                <span>Royal Points Loyalty Ledger</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                Royal Points Rewards 👑
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Earn Royal Points every time you write store reviews, place food orders, or refer friends in Korutla. Redeem points for store discounts!
              </p>
            </div>

            {/* Balance Badge */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-amber-500/40 text-center w-full md:w-auto shadow-2xl shadow-amber-950/40">
              <span className="text-xs font-bold text-slate-400 block mb-1">Your Royal Points Balance</span>
              <div className="flex items-center justify-center gap-2 text-4xl font-black text-amber-400">
                <Crown className="w-8 h-8 fill-amber-400" />
                <span>{pointsBalance}</span>
              </div>
              <span className="text-[11px] text-amber-300/80 font-semibold block mt-1">1 Point = ₹0.50 Discount Value</span>
            </div>
          </div>
        </div>

        {/* Earn Points Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit">
              <Crown className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Welcome Bonus</h3>
            <p className="text-xs text-slate-400">Earned +100 Royal Points automatically on creating your account.</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Write Business Reviews</h3>
            <p className="text-xs text-slate-400">Earn +50 points for every verified business review you post in Korutla.</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Invite Local Friends</h3>
            <p className="text-xs text-slate-400">Earn +100 points whenever a Korutla friend joins using your referral link.</p>
          </div>
        </div>

        {/* Available Vouchers Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <span>Redeem Points for Store Vouchers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REWARD_VOUCHERS.map((voucher) => {
              const isClaimed = !!claimedCodes[voucher.id];

              return (
                <div
                  key={voucher.id}
                  className="glass-card rounded-2xl p-5 border border-amber-500/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 bg-slate-900">
                      <Image src={voucher.image} alt={voucher.title} fill sizes="300px" className="object-cover" />
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-400 text-xs font-bold border border-amber-500/30">
                        {voucher.valueDiscount}
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{voucher.businessName}</span>
                    <h3 className="text-sm font-bold text-white leading-snug mt-0.5">{voucher.title}</h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Points Cost:</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 fill-amber-400" /> {voucher.pointsCost} Points
                      </span>
                    </div>

                    {isClaimed ? (
                      <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-center">
                        <span className="text-[10px] text-emerald-400 font-semibold block">Voucher Code Claimed:</span>
                        <span className="font-mono text-sm font-black text-white">{claimedCodes[voucher.id]}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaimVoucher(voucher.id, voucher.pointsCost, voucher.code)}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-colors shadow-md shadow-amber-500/20"
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
        <section className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Royal Points Ledger History</span>
          </h2>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{tx.reason}</h4>
                  <span className="text-[10px] text-slate-500">{tx.timestamp}</span>
                </div>
                <span className={`font-mono font-extrabold text-sm ${tx.type === 'EARNED' ? 'text-emerald-400' : 'text-rose-400'}`}>
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
