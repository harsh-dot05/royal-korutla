'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from '../common/SectionHeader';
import { ShoppingBag, Store, ArrowRight, Truck } from 'lucide-react';

export const GrocerySpotlight: React.FC = () => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Daily Essentials"
        title="Groceries &amp; Supermarts"
        subtitle="Get fresh organic vegetables, rice bags, cold-pressed oils, and dairy items delivered home from Green Fresh Mart in Korutla."
        actionText="Browse Grocery Mart"
        actionHref="/groceries"
      />

      <div className="pastel-card rounded-3xl p-6 sm:p-8 border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Store className="w-3.5 h-3.5" />
            <span>Green Fresh Organic Supermart</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900">
            Fresh Vegetables &amp; Daily Essentials Delivered Fast
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Free home delivery across Korutla town for orders above ₹300. Order directly on WhatsApp with instant itemized bill receipt.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold text-emerald-700 pt-1">
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4" /> Free Doorstep Delivery</span>
            <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" /> 100% Organic Products</span>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <Link
            href="/groceries"
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
          >
            <span>Shop Groceries Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
