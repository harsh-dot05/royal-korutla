'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CustomerUserType } from '@/types';
import {
  User,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
  Edit2,
  LogOut,
  Crown,
  Building,
  Save,
  X,
  MessageCircle,
} from 'lucide-react';

const KORUTLA_WARDS = Array.from({ length: 33 }, (_, i) => ({
  number: i + 1,
  label: `Ward ${i + 1} - Korutla Municipality`,
}));

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  userType: CustomerUserType;
  wardNumber?: number | null;
  villageName?: string | null;
  isVerified: boolean;
  points: number;
  createdAt: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUserType, setEditUserType] = useState<CustomerUserType>('KORUTLA_RESIDENT');
  const [editWardNumber, setEditWardNumber] = useState<number>(1);
  const [editVillageName, setEditVillageName] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Change Phone Flow State
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [phoneStep, setPhoneStep] = useState<'INPUT' | 'OTP'>('INPUT');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneCooldown, setPhoneCooldown] = useState(0);
  const [phoneLoading, setPhoneLoading] = useState(false);

  // Alert Feedback
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/profile');
      const data = await res.json();

      if (!res.ok || !data.success || !data.profile) {
        // Not authenticated
        router.push('/login?redirect=/profile');
        return;
      }

      setProfile(data.profile);
      setEditName(data.profile.name);
      setEditUserType(data.profile.userType);
      setEditWardNumber(data.profile.wardNumber || 1);
      setEditVillageName(data.profile.villageName || '');
    } catch {
      router.push('/login?redirect=/profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Phone cooldown timer
  useEffect(() => {
    if (phoneCooldown <= 0) return;
    const interval = setInterval(() => {
      setPhoneCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [phoneCooldown]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setUpdateLoading(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          userType: editUserType,
          wardNumber: editUserType === 'KORUTLA_RESIDENT' ? editWardNumber : null,
          villageName: editUserType === 'NON_LOCAL' ? editVillageName.trim() : null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAlert({ type: 'error', text: data.message || 'Failed to update profile.' });
        setUpdateLoading(false);
        return;
      }

      setProfile(data.profile);
      setIsEditing(false);
      setAlert({ type: 'success', text: 'Profile updated successfully.' });
    } catch {
      setAlert({ type: 'error', text: 'Error connecting to server.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setPhoneLoading(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: newPhone.trim(),
          purpose: 'change_phone',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAlert({
          type: 'error',
          text: data.message || 'Failed to send OTP to new mobile number.',
        });
        if (data.cooldownRemaining) {
          setPhoneCooldown(data.cooldownRemaining);
        }
        setPhoneLoading(false);
        return;
      }

      setPhoneStep('OTP');
      setPhoneCooldown(data.cooldownRemaining || 60);
      setAlert({
        type: 'success',
        text: 'Verification code sent to your new WhatsApp number.',
      });
    } catch {
      setAlert({ type: 'error', text: 'Failed to request OTP.' });
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOtp.trim()) return;

    setAlert(null);
    setPhoneLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: newPhone.trim(),
          otp: phoneOtp.trim(),
          purpose: 'change_phone',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAlert({ type: 'error', text: data.message || 'Invalid verification code.' });
        setPhoneLoading(false);
        return;
      }

      setAlert({ type: 'success', text: 'Mobile number updated and verified successfully!' });
      setIsChangingPhone(false);
      setPhoneStep('INPUT');
      setNewPhone('');
      setPhoneOtp('');
      await fetchProfile();
    } catch {
      setAlert({ type: 'error', text: 'Failed to verify new phone number.' });
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Continue redirect
    }
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16 text-center space-y-3">
          <RotateCw className="w-6 h-6 text-[#E66A32] animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#647067]">Loading your citizen profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-[#E66A32]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#26352D]">
                  {profile.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[10px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Citizen</span>
                </span>
              </div>
              <p className="text-xs text-[#647067] mt-0.5">
                Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] border border-[#E8E5DF] text-[#26352D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#E66A32]" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] text-[#BE123C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {alert && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
              alert.type === 'success'
                ? 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]'
                : 'bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C]'
            }`}
          >
            {alert.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{alert.text}</span>
          </div>
        )}

        {/* Quick KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Royal Points */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#647067] uppercase block">
                Royal Points
              </span>
              <span className="text-xl font-extrabold text-[#E66A32] mt-0.5 block">
                {profile.points || 100} pts
              </span>
              <Link
                href="/rewards"
                className="text-[11px] font-bold text-[#26352D] hover:text-[#E66A32] transition-colors mt-1 inline-block"
              >
                View vouchers &rarr;
              </Link>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFF6F0] border border-[#F8CFBE] flex items-center justify-center text-[#E66A32]">
              <Crown className="w-5 h-5 text-[#E66A32]" />
            </div>
          </div>

          {/* Location / Ward */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#647067] uppercase block">
                Location Area
              </span>
              <span className="text-sm font-extrabold text-[#26352D] mt-0.5 block line-clamp-1">
                {profile.userType === 'KORUTLA_RESIDENT'
                  ? `Ward ${profile.wardNumber || 'General'}, Korutla`
                  : `${profile.villageName || 'Outside Korutla'}`}
              </span>
              <span className="text-[11px] text-[#647067] mt-1 block">
                {profile.userType === 'KORUTLA_RESIDENT' ? 'Municipal Resident' : 'Surrounding Village'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] flex items-center justify-center text-[#26352D]">
              <MapPin className="w-5 h-5 text-[#E66A32]" />
            </div>
          </div>

          {/* Verified Phone */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#647067] uppercase block">
                Verified Mobile
              </span>
              <span className="text-sm font-extrabold text-[#26352D] mt-0.5 block">
                {profile.phone}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPhone(true);
                  setPhoneStep('INPUT');
                  setNewPhone('');
                  setAlert(null);
                }}
                className="text-[11px] font-bold text-[#E66A32] hover:underline mt-1 inline-block"
              >
                Change mobile &rarr;
              </button>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] flex items-center justify-center text-[#26352D]">
              <Phone className="w-5 h-5 text-[#25D366]" />
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        {isEditing && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#E66A32]/40 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-[#26352D]">Update Citizen Profile</h2>
              <p className="text-xs text-[#647067] mt-0.5">
                Keep your residential area up to date to receive local municipal and service notices.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#26352D] font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#26352D] font-bold mb-1">Residency Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditUserType('KORUTLA_RESIDENT')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                      editUserType === 'KORUTLA_RESIDENT'
                        ? 'bg-[#FFF6F0] border-[#E66A32] text-[#E66A32]'
                        : 'bg-[#FAF7F2] border-[#E8E5DF] text-[#647067]'
                    }`}
                  >
                    Korutla Resident (Wards 1–33)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditUserType('NON_LOCAL')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                      editUserType === 'NON_LOCAL'
                        ? 'bg-[#FFF6F0] border-[#E66A32] text-[#E66A32]'
                        : 'bg-[#FAF7F2] border-[#E8E5DF] text-[#647067]'
                    }`}
                  >
                    Outside Korutla / Village
                  </button>
                </div>
              </div>

              {editUserType === 'KORUTLA_RESIDENT' && (
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">
                    Select Your Municipal Ward (1 to 33) *
                  </label>
                  <select
                    value={editWardNumber}
                    onChange={(e) => setEditWardNumber(parseInt(e.target.value, 10))}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  >
                    {KORUTLA_WARDS.map((w) => (
                      <option key={w.number} value={w.number}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editUserType === 'NON_LOCAL' && (
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">
                    Village or Town Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editVillageName}
                    onChange={(e) => setEditVillageName(e.target.value)}
                    placeholder="e.g. Medipally, Kathalapur, Ibrahimpatnam..."
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#647067] font-bold hover:text-[#26352D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-5 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{updateLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Change Phone Modal */}
        {isChangingPhone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#26352D]/60 p-4">
            <div className="relative w-full max-w-md bg-white border border-[#E8E5DF] rounded-2xl p-6 shadow-xl space-y-4">
              <button
                type="button"
                onClick={() => setIsChangingPhone(false)}
                className="absolute top-4 right-4 text-[#647067] hover:text-[#26352D] p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-[#E66A32] uppercase tracking-wider block">
                  Security Verification
                </span>
                <h3 className="text-base font-extrabold text-[#26352D] mt-0.5">
                  Change Verified Mobile Number
                </h3>
                <p className="text-xs text-[#647067] mt-0.5">
                  We will send a 6-digit WhatsApp OTP to your new mobile number to verify ownership.
                </p>
              </div>

              {phoneStep === 'INPUT' ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">
                      New WhatsApp Mobile Number *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-bold text-[#647067]">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit mobile number"
                        className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-12 pr-4 py-2.5 text-xs text-[#26352D] focus:outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsChangingPhone(false)}
                      className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#647067] font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={phoneLoading || newPhone.length !== 10}
                      className="px-5 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{phoneLoading ? 'Sending OTP...' : 'Send WhatsApp OTP'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1">
                    <span className="text-[10px] font-bold text-[#647067] uppercase block">
                      Code Sent To:
                    </span>
                    <span className="text-xs font-extrabold text-[#26352D]">+91 {newPhone}</span>
                  </div>

                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">
                      Enter 6-Digit WhatsApp OTP *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit code"
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-4 py-2.5 text-center text-lg tracking-widest font-extrabold text-[#26352D] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#647067]">
                    {phoneCooldown > 0 ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#E66A32]" />
                        <span>Resend in {phoneCooldown}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendPhoneOtp}
                        disabled={phoneLoading}
                        className="font-bold text-[#E66A32] hover:underline flex items-center gap-1"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPhoneStep('INPUT')}
                      className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#647067] font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={phoneLoading || phoneOtp.length !== 6}
                      className="px-5 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{phoneLoading ? 'Verifying...' : 'Verify & Update'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/services"
            className="p-5 rounded-2xl bg-white border border-[#E8E5DF] hover:border-[#E66A32] transition-colors shadow-xs flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-[#26352D] group-hover:text-[#E66A32] transition-colors">
                Book Local Services
              </h3>
              <p className="text-xs text-[#647067] mt-0.5">
                Electrician, plumber, deep cleaning, carpenters in Korutla
              </p>
            </div>
            <span className="text-xs font-bold text-[#E66A32]">&rarr;</span>
          </Link>

          <Link
            href="/rewards"
            className="p-5 rounded-2xl bg-white border border-[#E8E5DF] hover:border-[#E66A32] transition-colors shadow-xs flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-[#26352D] group-hover:text-[#E66A32] transition-colors">
                Royal Points &amp; Vouchers
              </h3>
              <p className="text-xs text-[#647067] mt-0.5">
                Redeem discount coupons at local Korutla stores
              </p>
            </div>
            <span className="text-xs font-bold text-[#E66A32]">&rarr;</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
