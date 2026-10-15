'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeader } from '../common/SectionHeader';
import { ShoppingBag, Store, ArrowRight, Truck } from 'lucide-react';

export const GrocerySpotlight: React.FC = () => {
  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Groceries & Essentials">
      <SectionHeader
        badge="Daily Essentials"
        title="Groceries &amp; Marts"
        subtitle="Fresh vegetables, rice bags, oils, and dairy items from local stores in Korutla."
        actionText="Browse Groceries"
        actionHref="/groceries"
      />

      <div className="rounded-xl p-5 sm:p-7 border border-[#E8E5DF] bg-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs hover:border-[#E66A32] transition-colors">
        <div className="space-y-2.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold">
            <Store className="w-3.5 h-3.5 text-[#E66A32]" />
            <span>Green Fresh Organic Supermart</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#26352D]">
            Fresh Vegetables &amp; Daily Essentials
          </h3>
          <p className="text-xs sm:text-sm text-[#647067] leading-relaxed font-normal">
            Home delivery available across Korutla town for orders above ₹300. Order directly on WhatsApp with itemized details.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#26352D] pt-1">
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-[#E66A32]" /> Doorstep Delivery</span>
            <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4 text-[#E66A32]" /> Fresh Products</span>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <Link
            href="/groceries"
            className="px-5 py-2.5 rounded-lg bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Shop Groceries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
