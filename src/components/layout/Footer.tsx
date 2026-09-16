'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, MapPin, Heart, Shield } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

export const Footer: React.FC = () => {
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
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-slate-200">
          {/* Col 1: Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500 text-slate-950 shadow-sm">
                <Crown className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                Royal <span className="gradient-text-gold">Korutla</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Korutla’s premier local discovery platform. Empowering local businesses, shops, medical services, and residents with verified information.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Korutla, Jagtial Dist, Telangana - 505326</span>
            </div>
          </div>

          {/* Col 2: Sectors */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Local Sectors
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link href={getCategoryHref(cat.slug)} className="hover:text-purple-700 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: More Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              More Sectors
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat.id}>
                  <Link href={getCategoryHref(cat.slug)} className="hover:text-purple-700 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Platform Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Community &amp; Safety
            </h4>
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-purple-900 font-bold">
                <Shield className="w-4 h-4 text-purple-700" />
                <span>Verified Local Listings</span>
              </div>
              <p className="text-[11px] leading-normal font-medium text-slate-600">
                Want to list your shop, service, hospital, or property in Korutla? Contact local directory managers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Royal Korutla Discovery Portal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built for Korutla with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
