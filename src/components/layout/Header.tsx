'use client';

import React, { useState } from 'react';
import { Crown, MapPin, Search, Menu, X, PhoneCall, Sparkles } from 'lucide-react';
import { MobileNav } from './MobileNav';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
                <Crown className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                    Royal <span className="gradient-text-gold">Korutla</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Korutla Discovery Portal</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
                  <span className="text-slate-400 font-mono">505326</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7">
              <a href="#" className="text-sm font-semibold text-white hover:text-amber-400 transition-colors">
                Home
              </a>
              <a href="#categories" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Categories
              </a>
              <a href="#featured" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Featured
              </a>
              <a href="#offers" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Offers
              </a>
              <a href="#emergency" className="text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5" />
                Emergency 24/7
              </a>
            </nav>

            {/* Right Action Button & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const searchEl = document.getElementById('hero-search');
                  if (searchEl) searchEl.focus();
                }}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card text-xs font-medium text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all"
              >
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                <span>Search Korutla...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
                  /
                </kbd>
              </button>

              <a
                href="#categories"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
              >
                Explore All
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl glass-card text-slate-300 hover:text-white focus:outline-none"
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
