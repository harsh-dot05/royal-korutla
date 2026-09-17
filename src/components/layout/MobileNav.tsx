'use client';

import React from 'react';
import Link from 'next/link';
import { Home, X, ChevronRight, MapPin, Utensils, Briefcase, Building2, Store, Wrench, Shirt, GraduationCap, TreePine, PhoneCall, Tag } from 'lucide-react';
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
      case 'offers': return '/offers';
      default: return `/${slug}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <div>
              <span className="font-extrabold text-lg text-white">
                Royal <span className="text-blue-500">Korutla</span>
              </span>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-blue-400" /> Korutla Directory
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600/20 text-blue-400 font-semibold text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/food"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
            >
              <Utensils className="w-4 h-4 text-blue-400" />
              <span>Food &amp; Dining</span>
            </Link>
            <Link
              href="/grocery"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
            >
              <Store className="w-4 h-4 text-blue-400" />
              <span>Groceries &amp; Marts</span>
            </Link>
            <Link
              href="/shopping"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
            >
              <Shirt className="w-4 h-4 text-blue-400" />
              <span>Shopping &amp; Apparel</span>
            </Link>
            <Link
              href="/offers"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
            >
              <Tag className="w-4 h-4 text-blue-400" />
              <span>Offers &amp; Promotions</span>
            </Link>
            <Link
              href="/services"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
            >
              <Wrench className="w-4 h-4 text-blue-400" />
              <span>Services &amp; Repair</span>
            </Link>
            <Link
              href="/jobs"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
            >
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Local Jobs</span>
            </Link>
            <Link
              href="/real-estate"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Real Estate &amp; Rentals</span>
            </Link>
            <Link
              href="/hospitals"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-blue-400" />
              <span>Hospitals &amp; Doctors</span>
            </Link>
            <Link
              href="/education"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Education &amp; Tuition</span>
            </Link>
            <Link
              href="/public-places"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
            >
              <TreePine className="w-4 h-4 text-blue-400" />
              <span>Public Places &amp; Parks</span>
            </Link>
          </div>

          {/* Categories List */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Categories
            </span>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={getCategoryHref(cat.slug)}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info inside Drawer */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <p className="font-semibold text-slate-300">Royal Korutla</p>
          <p className="text-[11px] mt-0.5">Local Business &amp; Community Directory</p>
        </div>
      </div>
    </div>
  );
};
