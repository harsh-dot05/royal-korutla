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

      // Successful login -> Redirect to /admin
      router.replace('/admin');
      router.refresh();
    } catch (err) {
      setError('Invalid admin credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Korutla Directory</span>
        </Link>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
          Owner Access Only
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-xl bg-blue-700 text-white mx-auto flex items-center justify-center shadow-xs">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Royal Korutla Admin</h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Restricted access for authorized platform owner.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="admin-email" className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-700" />
                <span>Admin Email Address</span>
              </label>
              <input
                id="admin-email"
                type="email"
                required
                placeholder="admin@royalkorutla.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-medium"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-700" />
                <span>Admin Password</span>
              </label>
              <input
                id="admin-password"
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
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

          <div className="pt-3 border-t border-slate-100 text-center text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" /> Server Authorization Active
            </p>
            <p className="text-[10px] text-slate-400">
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
