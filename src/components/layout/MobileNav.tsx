'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Grid, Tag, PhoneCall, Sparkles, X, ChevronRight, MapPin, Utensils, Briefcase, Building2, Crown, Shield, Store, Wrench, Shirt, GraduationCap, TreePine } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const getCategoryHref = (slug: string) => {
    switch (slug) {
      case 'food': return '/food';
      case 'groceries': case 'grocery': return '/grocery';
      case 'shopping': return '/shopping';
      case 'services': return '/services';
      case 'hospitals': return '/hospitals';
      case 'education': return '/education';
      case 'public-places': return '/public-places';
      case 'jobs': return '/jobs';
      case 'real-estate': return '/real-estate';
      default: return `/${slug}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <div>
              <span className="font-extrabold text-lg text-white">
                Royal <span className="text-amber-400">Korutla</span>
              </span>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-400" /> Korutla Portal
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Links */}
          <div className="py-5 space-y-1.5">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-600/20 text-purple-400 font-semibold text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/food"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/60 text-slate-200 font-semibold text-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                <Utensils className="w-4 h-4 text-amber-400" />
                <span>Food &amp; WhatsApp Menu</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full">Hot</span>
            </Link>
            <Link
              href="/grocery"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 text-emerald-300 font-semibold text-sm transition-colors"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Groceries &amp; Marts</span>
            </Link>
            <Link
              href="/shopping"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 text-pink-300 font-semibold text-sm transition-colors"
            >
              <Shirt className="w-4 h-4 text-pink-400" />
              <span>Shopping &amp; Apparel</span>
            </Link>
            <Link
              href="/services"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 text-purple-300 font-semibold text-sm transition-colors"
            >
              <Wrench className="w-4 h-4 text-purple-400" />
              <span>Local Home Services</span>
            </Link>
            <Link
              href="/jobs"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 text-slate-300 font-medium text-sm transition-colors"
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Local Jobs Hiring</span>
            </Link>
            <Link
              href="/real-estate"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 text-slate-300 font-medium text-sm transition-colors"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Real Estate &amp; Rentals</span>
            </Link>
            <Link
              href="/hospitals"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 text-rose-400 font-medium text-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hospitals &amp; Emergency 24/7</span>
            </Link>
            <Link
              href="/education"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 text-indigo-300 font-medium text-sm transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Education &amp; Colleges</span>
            </Link>
            <Link
              href="/public-places"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 text-teal-300 font-medium text-sm transition-colors"
            >
              <TreePine className="w-4 h-4 text-teal-400" />
              <span>Public Places &amp; Landmarks</span>
            </Link>
          </div>

          {/* Categories Quick List */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
              Explore Sectors
            </span>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={getCategoryHref(cat.slug)}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800/40 hover:text-white"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info inside Drawer */}
        <div className="pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 text-center">
            <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-amber-300">Discover Korutla Locally</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Food, Services, Hospitals, Jobs &amp; Real Estate</p>
          </div>
        </div>
      </div>
    </div>
  );
};
