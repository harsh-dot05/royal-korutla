'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
        setError(data.message || 'Invalid Admin credentials. Access denied.');
        setLoading(false);
        return;
      }

      // Successful login -> Redirect to /admin
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Korutla Homepage</span>
        </Link>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
          Owner Portal Only
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 p-0.5 mx-auto shadow-lg shadow-purple-600/20">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Royal Korutla Admin</h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Restricted access for platform owner &amp; system administrators.
          </p>
        </div>

        <div className="pastel-card bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="admin@royalkorutla.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate &amp; Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Server Authorization Active
            </p>
            <p className="text-[10px] text-slate-400">
              Public user registration for Admin role is disabled. Unauthenticated attempts are logged.
            </p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-slate-400">
        © 2026 Royal Korutla 👑 • Owner &amp; Platform Security System
      </div>
    </div>
  );
}
