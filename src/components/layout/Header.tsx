'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Crown, MapPin, Search, Menu, X, PhoneCall, Utensils, Briefcase, Home, Wrench, Store, ShoppingBag, Tag } from 'lucide-react';
import { MobileNav } from './MobileNav';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-700 text-white shadow-sm">
                <Crown className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                    Royal <span className="text-blue-700">Korutla</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <MapPin className="w-3 h-3 text-blue-700" />
                  <span>Korutla Town</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-slate-400"></span>
                  <span className="text-slate-500 font-mono">505326</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5">
              <Link href="/" className="text-sm font-semibold text-blue-700 transition-colors">
                Home
              </Link>
              <Link href="/food" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-blue-700" />
                <span>Food</span>
              </Link>
              <Link href="/grocery" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors flex items-center gap-1.5">
                <Store className="w-4 h-4 text-blue-700" />
                <span>Groceries</span>
              </Link>
              <Link href="/shopping" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-blue-700" />
                <span>Shopping</span>
              </Link>
              <Link href="/offers" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-blue-700" />
                <span>Offers</span>
              </Link>
              <Link href="/services" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-700" />
                <span>Services</span>
              </Link>
              <Link href="/jobs" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-700" />
                <span>Jobs</span>
              </Link>
              <Link href="/real-estate" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors flex items-center gap-1.5">
                <Home className="w-4 h-4 text-blue-700" />
                <span>Real Estate</span>
              </Link>
              <Link href="/hospitals" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-blue-700" />
                <span>Hospitals</span>
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
                <Search className="w-3.5 h-3.5 text-blue-700" />
                <span>Search...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white rounded border border-slate-200">
                  /
                </kbd>
              </button>

              <Link
                href="/food"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
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
