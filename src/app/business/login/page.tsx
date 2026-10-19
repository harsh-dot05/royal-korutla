'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Crown, Store, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

function BusinessLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/business/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAccounts = [
    {
      title: 'Royal Paradise Restaurant (biz-1)',
      owner: 'Mohammed Ahmed',
      email: 'ahmed@royalbiryani.com',
      password: 'RoyalParadise2026!',
    },
    {
      title: 'Sri Laxmi Textiles & Silks (biz-3)',
      owner: 'B. Laxman Rao',
      email: 'laxman@srilaxmi.com',
      password: 'SriLaxmi2026!',
    },
    {
      title: 'Sri Sai Ram Electricals (biz-5)',
      owner: 'Ravi Sharma',
      email: 'ravi@srisairam.com',
      password: 'SaiRam2026!',
    },
  ];

  const handleFillTestAccount = (acc: (typeof testAccounts)[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both your registered business email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/business/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      router.push(redirectPath);
      router.refresh();
    } catch {
      setError('Network connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      {/* Brand & Heading */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E66A32] text-white shadow-xs mx-auto mb-2">
          <Store className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[#26352D] text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-[#E66A32]" />
          <span>Verified Merchant Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26352D] tracking-tight">
          Business Owner Sign In
        </h1>
        <p className="text-xs sm:text-sm text-[#647067] max-w-sm mx-auto">
          Manage your Korutla storefront, catalog, discounts, incoming customer leads, and Instant Reel requests.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-2xl border border-[#E8E5DF] p-6 sm:p-8 shadow-xs space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
              Business Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#647067] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ahmed@royalbiryani.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                Password
              </label>
              <Link
                href="/contact"
                className="text-[11px] font-semibold text-[#E66A32] hover:underline"
              >
                Help or Reset?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#647067] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your dashboard password"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#E66A32] hover:bg-[#CF5823] disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing In...</span>
              </span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[#E8E5DF] flex items-center justify-between text-xs text-[#647067]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#26352D]" />
            <span>Server-Verified Ownership</span>
          </span>
          <Link href="/businesses" className="hover:text-[#26352D] font-medium">
            Browse Directory →
          </Link>
        </div>
      </div>

      {/* Demo Credentials Quick-Fill (For Instant Testing) */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8E5DF] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#26352D] uppercase tracking-wider">
            Verified Test Merchant Accounts
          </span>
          <span className="text-[10px] text-[#647067] font-medium">Click to fill</span>
        </div>

        <div className="space-y-2">
          {testAccounts.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => handleFillTestAccount(acc)}
              className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#F4EFE7] border border-[#E8E5DF] text-xs flex items-center justify-between transition-colors group"
            >
              <div>
                <div className="font-bold text-[#26352D] group-hover:text-[#E66A32] transition-colors">
                  {acc.title}
                </div>
                <div className="text-[11px] text-[#647067]">
                  Owner: {acc.owner} • {acc.email}
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[#647067] group-hover:text-[#E66A32] shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BusinessLoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D] font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto p-8 text-center text-xs text-[#647067]">
              Loading login portal...
            </div>
          }
        >
          <BusinessLoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
