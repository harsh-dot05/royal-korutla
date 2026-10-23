'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Crown,
  Store,
  Shield,
  ArrowRight,
  Phone,
  CheckCircle2,
  Lock,
  UserCheck,
  Award,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [customerSuccess, setCustomerSuccess] = useState(false);

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim()) return;

    setIsCustomerLoading(true);
    // Simulate customer session stored locally for rewards & browsing
    setTimeout(() => {
      try {
        localStorage.setItem(
          'rk_customer_session',
          JSON.stringify({
            phone: customerPhone.trim(),
            name: customerName.trim() || 'Korutla Resident',
            points: 150,
            signedInAt: new Date().toISOString(),
          })
        );
      } catch {}
      setIsCustomerLoading(false);
      setCustomerSuccess(true);
      setTimeout(() => {
        router.push('/rewards');
      }, 1000);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-[#E66A32]" />
            <span>Royal Korutla Sign In</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
            Welcome to <span className="text-[#E66A32]">Royal Korutla</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#647067] leading-relaxed">
            Select your account type below to manage your business, check customer Royal Points, or access municipal admin controls.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Customer Points Sign In */}
          <div className="bg-white rounded-2xl border border-[#E8E5DF] p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF6F0] text-[#E66A32] border border-[#F8CFBE] flex items-center justify-center">
                <Award className="w-6 h-6 text-[#E66A32]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#26352D]">Customer Account</h3>
                <p className="text-xs text-[#647067] mt-1">
                  Access your Royal Points, redeem store discount vouchers, and track referral bonuses.
                </p>
              </div>

              {customerSuccess ? (
                <div className="p-3.5 rounded-xl bg-[#FFF6F0] border border-[#F8CFBE] text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-[#E66A32] mx-auto" />
                  <p className="text-xs font-bold text-[#26352D]">Signed in!</p>
                  <p className="text-[11px] text-[#647067]">Redirecting to Royal Points...</p>
                </div>
              ) : (
                <form onSubmit={handleCustomerLogin} className="space-y-2.5 pt-2 text-xs">
                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98480 12345"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3 py-2 text-[#26352D] placeholder-[#8A968D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">Your Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Suresh"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3 py-2 text-[#26352D] placeholder-[#8A968D] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCustomerLoading}
                    className="w-full py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>{isCustomerLoading ? 'Signing In...' : 'Sign In with Phone'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            <div className="pt-2 border-t border-[#E8E5DF]">
              <Link
                href="/rewards"
                className="text-xs font-bold text-[#E66A32] hover:underline flex items-center justify-between"
              >
                <span>Browse Reward Vouchers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. Merchant & Business Dashboard */}
          <div className="bg-white rounded-2xl border border-[#E8E5DF] p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F0F4F1] text-[#26352D] border border-[#26352D]/15 flex items-center justify-center">
                <Store className="w-6 h-6 text-[#26352D]" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF6F0] text-[#E66A32] border border-[#F8CFBE]">
                  Korutla Merchants
                </span>
                <h3 className="text-base font-bold text-[#26352D] mt-2">Business Dashboard</h3>
                <p className="text-xs text-[#647067] mt-1">
                  Manage your store listing, update menu &amp; catalog, review incoming customer leads, and order status.
                </p>
              </div>

              <div className="space-y-2 py-2 text-xs text-[#647067]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E66A32]" />
                  <span>Update shop photos &amp; timings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E66A32]" />
                  <span>Receive WhatsApp &amp; phone orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E66A32]" />
                  <span>Manage active store promotions</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E8E5DF]">
              <Link
                href="/business/login"
                className="w-full py-2.5 rounded-xl bg-[#26352D] hover:bg-[#1E2B24] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Merchant Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 3. Administration & Super Admin */}
          <div className="bg-white rounded-2xl border border-[#E8E5DF] p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF6F0] text-[#BE123C] border border-[#F8CFBE] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#BE123C]" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#647067] border border-[#E8E5DF]">
                  Platform Control
                </span>
                <h3 className="text-base font-bold text-[#26352D] mt-2">Owner &amp; Admin Panel</h3>
                <p className="text-xs text-[#647067] mt-1">
                  Private management of civic representatives, emergency services, business verifications, and system settings.
                </p>
              </div>

              <div className="space-y-2 py-2 text-xs text-[#647067]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#26352D]" />
                  <span>33 Ward councillors &amp; public reps</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#26352D]" />
                  <span>Emergency 24/7 contacts management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#26352D]" />
                  <span>Multi-admin roles &amp; audit security</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E8E5DF]">
              <Link
                href="/admin/login"
                className="w-full py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E8E5DF] hover:border-[#26352D] text-[#26352D] font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Shield className="w-3.5 h-3.5 text-[#BE123C]" />
                <span>Admin Login Portal</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#647067]" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
