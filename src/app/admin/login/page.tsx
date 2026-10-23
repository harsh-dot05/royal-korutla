'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Invalid admin credentials.');
        setLoading(false);
        return;
      }

      if (data.token) {
        try {
          localStorage.setItem('rk_session_token', data.token);
        } catch (e) {}
      }

      // Successful login -> Redirect to /admin
      router.replace('/admin');
      router.refresh();
    } catch (err) {
      setError('Invalid admin credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#26352D] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#647067] hover:text-[#26352D] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Korutla Directory</span>
        </Link>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#FFF6F0] text-[#E66A32] border border-[#F8CFBE]">
          Owner Access Only
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-xl bg-[#26352D] text-white mx-auto flex items-center justify-center shadow-xs">
            <Shield className="w-7 h-7 text-[#E66A32]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#26352D] tracking-tight">Royal Korutla Admin</h1>
          <p className="text-xs text-[#647067] max-w-xs mx-auto">
            Restricted access for authorized platform owner.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E5DF] shadow-xs space-y-5">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="admin-email" className="block font-bold text-[#26352D] mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Admin Email Address</span>
              </label>
              <input
                id="admin-email"
                type="email"
                required
                placeholder="admin@royalkorutla.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3.5 py-3 text-xs text-[#26352D] font-semibold placeholder-[#647067]/60 focus:outline-none focus:border-[#E66A32] focus:ring-2 focus:ring-[#FFF6F0] shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block font-bold text-[#26352D] mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Admin Password</span>
              </label>
              <input
                id="admin-password"
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3.5 py-3 text-xs text-[#26352D] font-semibold placeholder-[#647067]/60 focus:outline-none focus:border-[#E66A32] focus:ring-2 focus:ring-[#FFF6F0] shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-[#E8E5DF] text-center text-[11px] text-[#647067] space-y-1">
            <p className="font-semibold text-[#26352D] flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E66A32]" /> Server Authorization Active
            </p>
            <p className="text-[10px] text-[#647067]">
              Unauthenticated access attempts are logged.
            </p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-slate-400">
        © 2026 Royal Korutla • Owner Security System
      </div>
    </div>
  );
}
