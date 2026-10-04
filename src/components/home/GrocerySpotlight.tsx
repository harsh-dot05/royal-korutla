'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeader } from '../common/SectionHeader';
import { ShoppingBag, Store, ArrowRight, Truck } from 'lucide-react';

export const GrocerySpotlight: React.FC = () => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Daily Essentials"
        title="Groceries &amp; Marts"
        subtitle="Fresh vegetables, rice bags, oils, and dairy items from local stores in Korutla."
        actionText="Browse Groceries"
        actionHref="/grocery"
      />

      <div className="rounded-xl p-6 sm:p-8 border border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Store className="w-3.5 h-3.5 text-blue-600" />
            <span>Green Fresh Organic Supermart</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Fresh Vegetables &amp; Daily Essentials
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Home delivery available across Korutla town for orders above ₹300. Order directly on WhatsApp with itemized details.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-blue-600 pt-1">
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-blue-600" /> Doorstep Delivery</span>
            <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4 text-blue-600" /> Fresh Products</span>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <Link
            href="/grocery"
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Shop Groceries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
