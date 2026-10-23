'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  RoyalPointTransaction,
  RewardVoucher,
  ReferralRecord,
  ConfigurableRewardBenefit,
} from '@/types';
import {
  Crown,
  Gift,
  History,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Truck,
  ShieldCheck,
  Clock,
  RefreshCw,
  Users,
  Info,
} from 'lucide-react';

export default function RewardsPage() {
  const [balance, setBalance] = useState<number>(1300);
  const [earnedTotal, setEarnedTotal] = useState<number>(1800);
  const [spentTotal, setSpentTotal] = useState<number>(500);
  const [equivalentRupees, setEquivalentRupees] = useState<string>('13.00');
  const [transactions, setTransactions] = useState<RoyalPointTransaction[]>([]);
  const [vouchers, setVouchers] = useState<RewardVoucher[]>([]);
  const [configuredBenefit, setConfiguredBenefit] = useState<ConfigurableRewardBenefit | null>(null);
  
  // Referral State
  const [referralCode, setReferralCode] = useState<string>('RK-SRINI-9440');
  const [referralShareUrl, setReferralShareUrl] = useState<string>('https://royalkorutla.com/rewards?ref=RK-SRINI-9440');
  const [referralsList, setReferralsList] = useState<ReferralRecord[]>([]);
  const [referralStats, setReferralStats] = useState({
    totalInvited: 2,
    rewarded: 1,
    pending: 1,
    totalEarnedPoints: 500,
  });

  // Actions state
  const [inputFriendCode, setInputFriendCode] = useState<string>('');
  const [submittingCode, setSubmittingCode] = useState<boolean>(false);
  const [claimingBenefit, setClaimingBenefit] = useState<boolean>(false);
  const [claimedCodes, setClaimedCodes] = useState<{ [id: string]: string }>({});
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
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
        if (data.configuredBenefit) {
          setConfiguredBenefit(data.configuredBenefit);
        }
        if (data.referral) {
          setReferralCode(data.referral.code);
          setReferralShareUrl(data.referral.shareUrl);
          setReferralsList(data.referral.history || []);
          setReferralStats({
            totalInvited: data.referral.totalInvited || 0,
            rewarded: data.referral.rewarded || 0,
            pending: data.referral.pending || 0,
            totalEarnedPoints: data.referral.totalEarnedPoints || 0,
          });
        }
      }
    } catch {
      // Fallback retained
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleApplyFriendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputFriendCode.trim()) return;

    setSubmittingCode(true);
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply_referral',
          referralCode: inputFriendCode.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAlertMessage({ type: 'success', text: data.message });
        setInputFriendCode('');
        fetchRewardsData();
      } else {
        setAlertMessage({ type: 'error', text: data.message || 'Failed to apply referral code.' });
      }
    } catch {
      setAlertMessage({ type: 'error', text: 'Network error applying referral code.' });
    } finally {
      setSubmittingCode(false);
    }
  };

  const handleClaimVoucher = async (voucherId: string, cost: number) => {
    if (balance < cost) {
      setAlertMessage({
        type: 'error',
        text: `You need ${cost.toLocaleString()} Royal Points to redeem this voucher. Your current balance is ${balance.toLocaleString()} Points.`,
      });
      return;
    }

    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim_voucher', voucherId }),
      });

      const data = await res.json();
      if (data.success) {
        setClaimedCodes((prev) => ({ ...prev, [voucherId]: data.code }));
        setAlertMessage({
          type: 'success',
          text: `Reward claimed successfully! Your store voucher code is "${data.code}".`,
        });
        fetchRewardsData();
      } else {
        setAlertMessage({
          type: 'error',
          text: data.message || 'Failed to redeem voucher.',
        });
      }
    } catch {
      setAlertMessage({
        type: 'error',
        text: 'An error occurred while claiming the voucher.',
      });
    }
  };

  const handleClaimBenefit = async () => {
    if (!configuredBenefit) return;
    if (balance < configuredBenefit.pointsCost) {
      setAlertMessage({
        type: 'error',
        text: `You need ${configuredBenefit.pointsCost.toLocaleString()} Royal Points to activate this pass. Current balance: ${balance.toLocaleString()} Points.`,
      });
      return;
    }

    setClaimingBenefit(true);
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim_benefit' }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage({ type: 'success', text: data.message });
        fetchRewardsData();
      } else {
        setAlertMessage({ type: 'error', text: data.message || 'Failed to claim benefit.' });
      }
    } catch {
      setAlertMessage({ type: 'error', text: 'Error claiming delivery benefit.' });
    } finally {
      setClaimingBenefit(false);
    }
  };

  const whatsappShareText = encodeURIComponent(
    `Join me on Royal Korutla for local shopping, food ordering, and services! Use my referral code ${referralCode} to get 500 bonus Royal Points: ${referralShareUrl}`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Alert Banner */}
        {alertMessage && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all shadow-xs ${
              alertMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {alertMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              )}
              <span>{alertMessage.text}</span>
            </div>
            <button
              onClick={() => setAlertMessage(null)}
              className="text-[#647067] hover:text-[#26352D] underline text-xs font-semibold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. Header & Current Points Balance Card */}
        <div className="rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E8E5DF] bg-white shadow-md space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-xs font-bold text-[#E66A32]">
                <Crown className="w-3.5 h-3.5 text-[#E66A32]" />
                <span className="uppercase tracking-wider text-[11px]">Royal Rewards &amp; Loyalty Ledger</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#26352D] tracking-tight">
                Royal Points Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] max-w-2xl leading-relaxed">
                Earn authentic loyalty points with new signups, verified referrals, and completed merchant orders in Korutla. Every 1,000 points represent ₹10 in transparent stated reward value.
              </p>
            </div>

            {/* Current Balance Box */}
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#E66A32] text-center w-full md:w-80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-[#647067] uppercase tracking-wider block">
                Current Points Balance
              </span>
              <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-black text-[#E66A32] my-1">
                <Crown className="w-7 h-7 text-[#E66A32] shrink-0" />
                <span>{balance.toLocaleString()}</span>
              </div>
              <div className="text-sm font-black text-[#26352D]">
                ≈ ₹{equivalentRupees} Stated Value
              </div>
              <span className="text-[10px] text-[#647067] font-medium block">
                (Strict conversion: 1,000 Points = ₹10.00)
              </span>
            </div>
          </div>

          {/* Points Breakdown Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8E5DF]">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-[#E8E5DF] text-emerald-700">
                  <PlusCircle className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <span className="text-xs text-[#647067] font-semibold block">Total Points Earned</span>
                  <span className="text-base font-black text-[#26352D]">+{earnedTotal.toLocaleString()} Pts</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800">≈ ₹{(earnedTotal / 100).toFixed(2)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-[#E8E5DF] text-rose-700">
                  <MinusCircle className="w-5 h-5 text-rose-700" />
                </div>
                <div>
                  <span className="text-xs text-[#647067] font-semibold block">Total Points Redeemed</span>
                  <span className="text-base font-black text-[#26352D]">-{spentTotal.toLocaleString()} Pts</span>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-800">≈ ₹{(spentTotal / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 2. Referral System & Invitation Dashboard */}
        <section className="rounded-3xl p-6 sm:p-8 bg-white border border-[#E8E5DF] shadow-md space-y-6" aria-label="Referral Rewards">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E8E5DF] pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-xs font-bold text-[#E66A32] mb-1.5">
                <Users className="w-3.5 h-3.5 text-[#E66A32]" />
                <span className="uppercase tracking-wider text-[10px]">Invite Friends &amp; Earn</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#26352D]">
                Referral Program &amp; Invitation Status
              </h2>
              <p className="text-xs text-[#647067] mt-1 max-w-xl">
                Share your unique invitation code with family and friends in Korutla. When they join and complete a qualifying order, <strong>both of you receive 500 Royal Points</strong> (≈ ₹5.00 value).
              </p>
            </div>

            {/* Referral Stats Summary Badges */}
            <div className="flex items-center gap-2.5">
              <div className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] text-center">
                <span className="text-[10px] text-[#647067] block font-bold uppercase">Friends Invited</span>
                <span className="text-base font-black text-[#26352D]">{referralStats.totalInvited}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-800 block font-bold uppercase">Rewarded</span>
                <span className="text-base font-black text-emerald-900">{referralStats.rewarded}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[10px] text-amber-800 block font-bold uppercase">Pending</span>
                <span className="text-base font-black text-amber-900">{referralStats.pending}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Your Unique Referral Code & Sharing Card */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-4">
                <span className="text-xs font-bold text-[#26352D] block">
                  Your Unique Referral Code:
                </span>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E8E5DF] font-mono font-black text-lg sm:text-xl text-[#26352D] tracking-wider flex items-center justify-between">
                    <span>{referralCode}</span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-xs font-bold text-[#E66A32] hover:underline flex items-center gap-1"
                      aria-label="Copy code"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <a
                    href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-[#26352D] hover:bg-[#1C2721] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center justify-between text-xs text-[#647067] pt-1">
                  <span className="truncate pr-2">Link: {referralShareUrl}</span>
                  <button
                    onClick={handleCopyLink}
                    className="text-[#E66A32] font-bold hover:underline shrink-0 flex items-center gap-1"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E8E5DF] text-[11px] text-[#647067] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Strict Anti-Abuse Rules:</strong> Self-referrals, duplicate accounts with the same phone or device, and repeated requests are automatically blocked by the server ledger.
                  </span>
                </div>
              </div>

              {/* Enter a Friend's Referral Code */}
              <div className="p-5 rounded-2xl bg-white border border-[#E8E5DF] space-y-3">
                <h3 className="text-xs font-bold text-[#26352D]">
                  Invited by a friend in Korutla? Enter their code:
                </h3>
                <form onSubmit={handleApplyFriendCode} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. RK-KOR-XXXX"
                    value={inputFriendCode}
                    onChange={(e) => setInputFriendCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] focus:bg-white text-xs font-mono font-bold text-[#26352D] uppercase placeholder-[#647067] focus:outline-none focus:border-[#E66A32]"
                  />
                  <button
                    type="submit"
                    disabled={submittingCode}
                    className="px-5 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-60"
                  >
                    {submittingCode ? 'Applying...' : 'Apply Code'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Friends Invited & Qualifying Ledger */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-bold text-[#26352D] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#E66A32]" />
                <span>Invited Friends &amp; Status ({referralsList.length})</span>
              </h3>

              {referralsList.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF7F2] rounded-2xl border border-[#E8E5DF] text-xs text-[#647067] space-y-1">
                  <Users className="w-6 h-6 text-[#647067] mx-auto mb-1 opacity-60" />
                  <p className="font-bold text-[#26352D]">No referrals recorded yet</p>
                  <p className="text-[11px]">Share your link above to invite friends and earn 500 points each.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {referralsList.map((ref) => {
                    const isRewarded = ref.status === 'REWARDED';
                    const isFlagged = ref.status === 'FLAGGED_ABUSE';
                    return (
                      <div
                        key={ref.id}
                        className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-[#26352D]">{ref.invitedName}</p>
                          <p className="text-[10px] text-[#647067] font-mono">
                            {ref.invitedEmail.replace(/(.{3})(.*)(@.*)/, '$1***$3')}
                          </p>
                        </div>

                        <div className="text-right space-y-0.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider inline-block ${
                              isRewarded
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : isFlagged
                                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {isRewarded ? '+500 Pts Awarded' : isFlagged ? 'Flagged (Abuse)' : 'Pending Order'}
                          </span>
                          <span className="text-[10px] text-[#647067] block">
                            {isRewarded ? 'Qualified' : isFlagged ? 'Suspicious' : 'Awaiting qualifying order'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. Configurable 5,000-Point Benefit: Royal Town Free Delivery Pass */}
        {configuredBenefit && configuredBenefit.isActive && (
          <section className="rounded-3xl p-6 sm:p-8 bg-white border-2 border-[#26352D] shadow-md space-y-5" aria-label="5,000-Point Reward Benefit">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-xs font-bold text-[#E66A32]">
                  <Truck className="w-3.5 h-3.5 text-[#E66A32]" />
                  <span>Platform Exclusive Tier Benefit</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#26352D]">
                  {configuredBenefit.title}
                </h2>
                <p className="text-xs text-[#647067] max-w-2xl">
                  {configuredBenefit.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] text-center w-full sm:w-auto shrink-0 space-y-1">
                <span className="text-[10px] font-bold text-[#647067] uppercase block">Redemption Cost</span>
                <span className="text-2xl font-black text-[#26352D] block">
                  {configuredBenefit.pointsCost.toLocaleString()} Pts
                </span>
                <span className="text-[10px] font-semibold text-[#647067] block">
                  ≈ ₹{(configuredBenefit.pointsCost / 100).toFixed(2)} Stated Value
                </span>
              </div>
            </div>

            {/* Clear Eligibility Rules Grid */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-2">
              <span className="text-xs font-bold text-[#26352D] block">
                Official Eligibility Rules &amp; Redemption Conditions:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#647067]">
                {configuredBenefit.eligibilityRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-[#647067] pt-2 border-t border-[#E8E5DF]">
                <em>Terms:</em> {configuredBenefit.termsAndConditions}
              </p>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <span className="text-xs text-[#647067]">
                Your current balance: <strong>{balance.toLocaleString()} Points</strong>
              </span>

              <button
                type="button"
                onClick={handleClaimBenefit}
                disabled={balance < configuredBenefit.pointsCost || claimingBenefit}
                className={`px-6 py-3 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-2 ${
                  balance >= configuredBenefit.pointsCost
                    ? 'bg-[#26352D] hover:bg-[#1C2721] text-white'
                    : 'bg-[#FAF7F2] border border-[#E8E5DF] text-[#647067] cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#E66A32]" />
                <span>
                  {claimingBenefit
                    ? 'Activating Pass...'
                    : balance >= configuredBenefit.pointsCost
                    ? 'Redeem 5,000 Pts for Delivery Pass'
                    : `Need ${(configuredBenefit.pointsCost - balance).toLocaleString()} More Points`}
                </span>
              </button>
            </div>
          </section>
        )}

        {/* 4. Points Rules & Value Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-[#E8E5DF] bg-white shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#26352D]">
              <Crown className="w-4 h-4 text-[#E66A32]" />
              <span>1,000 Pts Welcome Bonus</span>
            </div>
            <p className="text-xs text-[#647067] leading-relaxed">
              Every newly registered customer receives 1,000 Royal Points (₹10.00 equivalent value) upon initial account creation.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#E8E5DF] bg-white shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#26352D]">
              <Users className="w-4 h-4 text-[#E66A32]" />
              <span>500 Pts Referral Reward</span>
            </div>
            <p className="text-xs text-[#647067] leading-relaxed">
              When an invited friend joins with your code and verifies their first order, both inviter and invited user receive 500 Points.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#E8E5DF] bg-white shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#26352D]">
              <Gift className="w-4 h-4 text-[#E66A32]" />
              <span>Transparent Store Vouchers</span>
            </div>
            <p className="text-xs text-[#647067] leading-relaxed">
              Redeem accumulated points for instant billing discounts at participating restaurants, boutiques, and mart shops in Korutla.
            </p>
          </div>
        </div>

        {/* 5. Points History Ledger Section */}
        <section className="rounded-3xl p-6 sm:p-8 border border-[#E8E5DF] bg-white shadow-md space-y-4" aria-label="Transaction History">
          <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-4">
            <div className="flex items-center gap-2 text-[#26352D]">
              <History className="w-5 h-5 text-[#E66A32]" />
              <h2 className="text-lg font-black">Auditable Points Transaction Ledger</h2>
            </div>
            <button
              onClick={fetchRewardsData}
              disabled={loading}
              className="text-xs font-bold text-[#647067] hover:text-[#26352D] flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#E66A32]' : ''}`} />
              <span>Refresh Ledger</span>
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#647067] font-semibold">
              <RefreshCw className="w-5 h-5 animate-spin text-[#E66A32] mx-auto mb-2" />
              Loading verified transaction ledger...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center space-y-2 bg-[#FAF7F2] rounded-2xl border border-[#E8E5DF]">
              <History className="w-8 h-8 text-[#647067] mx-auto opacity-50" />
              <h3 className="text-sm font-bold text-[#26352D]">No Transactions Recorded Yet</h3>
              <p className="text-xs text-[#647067]">Your transactions history will appear here as you earn and redeem loyalty points.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {transactions.map((tx) => {
                const isEarned = tx.type === 'EARNED';
                return (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors hover:border-[#26352D]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            tx.category === 'SIGNUP'
                              ? 'bg-[#FFF6F0] text-[#E66A32] border border-[#F8CFBE]'
                              : tx.category === 'REFERRAL'
                              ? 'bg-[#F0F7F3] text-[#26352D] border border-[#C8DFD1]'
                              : tx.category === 'REDEMPTION'
                              ? 'bg-[#FFF6F0] text-[#E66A32] border border-[#F8CFBE]'
                              : 'bg-[#F0F7F3] text-[#26352D] border border-[#C8DFD1]'
                          }`}
                        >
                          {tx.category || (isEarned ? 'EARNED' : 'REDEEMED')}
                        </span>
                        <span className="font-bold text-[#26352D]">{tx.reason}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#647067] font-mono">
                        <span>Ref: #{tx.id}</span>
                        <span>•</span>
                        <span>{tx.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span
                        className={`font-mono font-black text-base block ${
                          isEarned ? 'text-emerald-800' : 'text-rose-800'
                        }`}
                      >
                        {isEarned ? '+' : '-'}{tx.amount.toLocaleString()} Pts
                      </span>
                      <span className="text-[10px] text-[#647067] font-semibold">
                        ≈ ₹{(tx.amount / 100).toFixed(2)} value
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 6. Available Store Discount Vouchers */}
        <section className="space-y-4" aria-label="Store Vouchers">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#26352D] flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#E66A32]" />
              <span>Available Store Discount Vouchers</span>
            </h2>
            <span className="text-xs text-[#647067]">
              {vouchers.length} Local Partner Offers
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#647067] font-semibold">
              Loading reward vouchers...
            </div>
          ) : vouchers.length === 0 ? (
            <div className="p-10 text-center space-y-2 bg-[#FAF7F2] rounded-2xl border border-[#E8E5DF]">
              <Gift className="w-8 h-8 text-[#647067] mx-auto opacity-50" />
              <h3 className="text-sm font-bold text-[#26352D]">No Vouchers Available</h3>
              <p className="text-xs text-[#647067]">Check back soon for new local store discount vouchers in Korutla.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vouchers.map((voucher) => {
                const isClaimed = !!claimedCodes[voucher.id];
                const canAfford = balance >= voucher.pointsCost;

                return (
                  <div
                    key={voucher.id}
                    className="rounded-3xl p-5 border border-[#E8E5DF] bg-white shadow-xs flex flex-col justify-between transition-all hover:border-[#26352D] hover:shadow-md"
                  >
                    <div>
                      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-3 bg-[#FAF7F2] border border-[#E8E5DF]">
                        <Image
                          src={voucher.image}
                          alt={voucher.title}
                          fill
                          sizes="350px"
                          className="object-cover"
                        />
                        <div className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-[#E66A32] text-white text-xs font-black shadow-xs">
                          {voucher.valueDiscount}
                        </div>
                      </div>

                      <span className="text-[10px] font-extrabold text-[#E66A32] uppercase tracking-wider block">
                        {voucher.businessName}
                      </span>
                      <h3 className="text-sm font-bold text-[#26352D] leading-snug mt-1">
                        {voucher.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8E5DF] space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#647067]">Points Required:</span>
                        <span className="text-[#26352D] font-black flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-[#E66A32]" />
                          <span>{voucher.pointsCost.toLocaleString()} Pts</span>
                        </span>
                      </div>

                      {isClaimed ? (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-0.5">
                          <span className="text-[10px] text-emerald-800 font-bold block uppercase">
                            Voucher Code Claimed:
                          </span>
                          <span className="font-mono text-base font-black text-[#26352D]">
                            {claimedCodes[voucher.id]}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleClaimVoucher(voucher.id, voucher.pointsCost)}
                          disabled={!canAfford}
                          className={`w-full py-2.5 rounded-xl text-white font-bold text-xs transition-colors shadow-xs ${
                            canAfford
                              ? 'bg-[#E66A32] hover:bg-[#D45B25]'
                              : 'bg-[#E8E5DF] text-[#647067] cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Redeem Voucher' : `Insufficient Points (${balance}/${voucher.pointsCost})`}
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
