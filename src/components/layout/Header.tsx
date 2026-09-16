'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Crown, MapPin, Search, Menu, X, PhoneCall, Sparkles, Utensils, Briefcase, Home, Shield, Wrench } from 'lucide-react';
import { MobileNav } from './MobileNav';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 pastel-header bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Crown className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                    Royal <span className="gradient-text-gold">Korutla</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>Korutla Town</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-slate-400"></span>
                  <span className="text-slate-500 font-mono">505326</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" className="text-sm font-semibold text-purple-700 hover:text-purple-900 transition-colors">
                Home
              </Link>
              <Link href="/food" className="text-sm font-medium text-slate-700 hover:text-purple-700 transition-colors flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-600" />
                <span>Food</span>
              </Link>
              <Link href="/services" className="text-sm font-medium text-slate-700 hover:text-purple-700 transition-colors flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-purple-600" />
                <span>Services</span>
              </Link>
              <Link href="/jobs" className="text-sm font-medium text-slate-700 hover:text-purple-700 transition-colors flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Jobs</span>
              </Link>
              <Link href="/real-estate" className="text-sm font-medium text-slate-700 hover:text-purple-700 transition-colors flex items-center gap-1.5">
                <Home className="w-4 h-4 text-emerald-600" />
                <span>Real Estate</span>
              </Link>
              <Link href="/hospitals" className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                <span>Hospitals 24/7</span>
              </Link>
              <Link href="/rewards" className="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1.5">
                <Crown className="w-4 h-4" />
                <span>Rewards</span>
              </Link>
            </nav>

            {/* Right Action Button & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const searchEl = document.getElementById('hero-search');
                  if (searchEl) searchEl.focus();
                }}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-medium text-slate-700 border border-slate-200 transition-all"
              >
                <Search className="w-3.5 h-3.5 text-purple-600" />
                <span>Search...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white rounded border border-slate-200">
                  /
                </kbd>
              </button>

              <Link
                href="/food"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white transition-all shadow-md shadow-amber-500/20"
              >
                Order Food
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};
