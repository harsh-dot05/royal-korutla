'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  AlertCircle,
  Clock,
  RotateCw,
  MapPin,
  Building,
  User,
  MessageCircle,
} from 'lucide-react';

const KORUTLA_WARDS = Array.from({ length: 33 }, (_, i) => ({
  number: i + 1,
  label: `Ward ${i + 1} - Korutla Municipality`,
}));

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/profile';

  // Mode: 'signin' | 'register'
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Registration Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState<'KORUTLA_RESIDENT' | 'NON_LOCAL'>('KORUTLA_RESIDENT');
  const [wardNumber, setWardNumber] = useState<number>(1);
  const [villageName, setVillageName] = useState('');

  // OTP Verification State
  const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState<number>(0);

  // Status & Errors
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check if returning user already has a valid session
  useEffect(() => {
    let isMounted = true;
    async function checkExistingSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (isMounted && data.authenticated && data.user) {
          if (data.user.role === 'CUSTOMER') {
            router.push(redirectUrl);
          }
        }
      } catch {
        // Not authenticated, stay on page
      }
    }
    checkExistingSession();
    return () => {
      isMounted = false;
    };
  }, [router, redirectUrl]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const payload: {
        phone: string;
        purpose: 'login' | 'register';
        registrationData?: {
          name: string;
          userType: 'KORUTLA_RESIDENT' | 'NON_LOCAL';
          wardNumber?: number | null;
          villageName?: string | null;
        };
      } = {
        phone: phone.trim(),
        purpose: authMode === 'register' ? 'register' : 'login',
      };

      if (authMode === 'register') {
        payload.registrationData = {
          name: fullName.trim(),
          userType,
          wardNumber: userType === 'KORUTLA_RESIDENT' ? wardNumber : null,
          villageName: userType === 'NON_LOCAL' ? villageName.trim() : null,
        };
      }

      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Failed to send WhatsApp verification code.');
        if (data.cooldownRemaining) {
          setCooldown(data.cooldownRemaining);
        }
        setIsLoading(false);
        return;
      }

      setStep('OTP');
      setCooldown(data.cooldownRemaining || 60);
      setSuccessMsg(data.message || 'Verification code sent to your WhatsApp number.');
    } catch {
      setErrorMsg('Failed to communicate with authentication server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          otp: otp.trim(),
          purpose: authMode === 'register' ? 'register' : 'login',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Invalid verification code.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg(data.message || 'Authentication successful! Redirecting...');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 900);
    } catch {
      setErrorMsg('Failed to verify OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBackToInput = () => {
    setStep('INPUT');
    setOtp('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-[#E66A32]" />
            <span>Royal Korutla Citizen Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26352D] tracking-tight">
            Customer <span className="text-[#E66A32]">Authentication</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#647067] leading-relaxed">
            Verify your mobile number via WhatsApp OTP to access your Korutla customer profile,
            book local services, earn Royal Points, and manage your account.
          </p>
        </div>

        {/* Customer Auth Card */}
        <div className="max-w-xl mx-auto w-full bg-white rounded-2xl border border-[#E8E5DF] p-6 sm:p-8 shadow-xs space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setStep('INPUT');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-lg transition-colors ${
                authMode === 'signin'
                  ? 'bg-white text-[#26352D] shadow-2xs'
                  : 'text-[#647067] hover:text-[#26352D]'
              }`}
            >
              Sign In (Existing User)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setStep('INPUT');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-lg transition-colors ${
                authMode === 'register'
                  ? 'bg-white text-[#26352D] shadow-2xs'
                  : 'text-[#647067] hover:text-[#26352D]'
              }`}
            >
              New User Registration
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Step 1: Input Form */}
          {step === 'INPUT' && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name (e.g. Ramesh Reddy)"
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#26352D] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#26352D] font-bold mb-1">
                  WhatsApp Mobile Number *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs sm:text-sm font-bold text-[#647067]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-12 pr-4 py-2.5 text-xs sm:text-sm text-[#26352D] focus:outline-none font-medium"
                  />
                </div>
                <p className="text-[11px] text-[#647067] mt-1">
                  We will send a 6-digit verification code directly to your WhatsApp.
                </p>
              </div>

              {/* Conditional Location Fields for Registration */}
              {authMode === 'register' && (
                <div className="space-y-3 pt-1 border-t border-[#E8E5DF]">
                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">
                      Are you living in Korutla Town? *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setUserType('KORUTLA_RESIDENT')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                          userType === 'KORUTLA_RESIDENT'
                            ? 'bg-[#FFF6F0] border-[#E66A32] text-[#E66A32]'
                            : 'bg-[#FAF7F2] border-[#E8E5DF] text-[#647067]'
                        }`}
                      >
                        Yes, Korutla Resident
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserType('NON_LOCAL')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                          userType === 'NON_LOCAL'
                            ? 'bg-[#FFF6F0] border-[#E66A32] text-[#E66A32]'
                            : 'bg-[#FAF7F2] border-[#E8E5DF] text-[#647067]'
                        }`}
                      >
                        Outside Korutla / Village
                      </button>
                    </div>
                  </div>

                  {/* If Korutla Resident -> Show Ward Selector */}
                  {userType === 'KORUTLA_RESIDENT' && (
                    <div>
                      <label className="block text-[#26352D] font-bold mb-1">
                        Select Your Municipal Ward (1 to 33) *
                      </label>
                      <select
                        value={wardNumber}
                        onChange={(e) => setWardNumber(parseInt(e.target.value, 10))}
                        className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#26352D] focus:outline-none"
                      >
                        {KORUTLA_WARDS.map((w) => (
                          <option key={w.number} value={w.number}>
                            {w.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-[#647067] mt-1">
                        Helps us connect you with your ward representative and local municipal announcements.
                      </p>
                    </div>
                  )}

                  {/* If Non-Local -> Show Village Name Input */}
                  {userType === 'NON_LOCAL' && (
                    <div>
                      <label className="block text-[#26352D] font-bold mb-1">
                        Village or Town Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={villageName}
                        onChange={(e) => setVillageName(e.target.value)}
                        placeholder="e.g. Medipally, Kathalapur, Ibrahimpatnam, Metpally..."
                        className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#26352D] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {isLoading
                    ? 'Sending Code...'
                    : authMode === 'register'
                    ? 'Get WhatsApp OTP to Register'
                    : 'Get WhatsApp OTP to Sign In'}
                </span>
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification Form */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1">
                <span className="text-[10px] font-bold text-[#647067] uppercase block">
                  Verification Code Sent To:
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#26352D]">+91 {phone}</span>
                  <button
                    type="button"
                    onClick={handleBackToInput}
                    className="text-xs font-bold text-[#E66A32] hover:underline"
                  >
                    Change Number
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#26352D] font-bold mb-1">
                  Enter 6-Digit WhatsApp OTP *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit code"
                  className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-4 py-3 text-center text-lg tracking-widest font-extrabold text-[#26352D] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#647067]">
                <span>Didn&apos;t receive code?</span>
                {cooldown > 0 ? (
                  <span className="flex items-center gap-1 font-semibold text-[#647067]">
                    <Clock className="w-3.5 h-3.5 text-[#E66A32]" />
                    <span>Resend in {cooldown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="font-bold text-[#E66A32] hover:underline flex items-center gap-1"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackToInput}
                  className="px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] text-[#647067] font-bold hover:text-[#26352D]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {isLoading
                      ? 'Verifying...'
                      : authMode === 'register'
                      ? 'Verify & Create Account'
                      : 'Verify & Sign In'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Alternate Portals: Business Owner & Admin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {/* Business Owner Portal */}
          <Link
            href="/business/login"
            className="p-4 rounded-2xl bg-white border border-[#E8E5DF] hover:border-[#E66A32] transition-colors shadow-xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#26352D] border border-[#E8E5DF] flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-[#E66A32]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#26352D] group-hover:text-[#E66A32] transition-colors">
                  Business Owner Login
                </h4>
                <p className="text-[11px] text-[#647067]">Manage shop listings &amp; orders</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#647067] group-hover:text-[#E66A32] transition-colors" />
          </Link>

          {/* Municipal Admin Portal */}
          <Link
            href="/admin/login"
            className="p-4 rounded-2xl bg-white border border-[#E8E5DF] hover:border-[#26352D] transition-colors shadow-xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#26352D] border border-[#E8E5DF] flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-[#26352D]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#26352D]">Owner &amp; Admin Panel</h4>
                <p className="text-[11px] text-[#647067]">Town directory &amp; moderation</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#647067] transition-colors" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
      <LoginContent />
    </Suspense>
  );
}
