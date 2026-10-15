'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from '../common/SectionHeader';
import { FOOD_MENU_ITEMS, FEATURED_BUSINESSES } from '../../data/mockData';
import { Star, MessageSquare } from 'lucide-react';

export const FoodSpotlight: React.FC = () => {
  const foodBiz = FEATURED_BUSINESSES.find((b) => b.categorySlug === 'food') || FEATURED_BUSINESSES[0];

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Food & Restaurants">
      <SectionHeader
        badge="Korutla Food"
        title="Food &amp; Restaurant Menu"
        subtitle="Order biryani, starters, tiffins, and meals directly from Korutla restaurants."
        actionText="Explore Food Menu"
        actionHref="/food"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FOOD_MENU_ITEMS.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="rounded-xl overflow-hidden border border-[#E8E5DF] flex flex-col justify-between bg-white shadow-xs hover:border-[#E66A32] transition-colors"
          >
            <div>
              <div className="relative h-44 w-full bg-[#FAF7F2] overflow-hidden border-b border-[#E8E5DF]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white text-xs font-bold text-[#26352D] flex items-center gap-1 shadow-xs border border-[#E8E5DF]">
                  <Star className="w-3.5 h-3.5 fill-[#E66A32] text-[#E66A32]" />
                  <span>{item.rating || 4.8}</span>
                </div>

                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#E66A32] text-white font-bold text-xs shadow-xs">
                  ₹{item.price}
                </div>
              </div>

              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold text-[#E66A32] uppercase tracking-wider block">
                  {foodBiz.name}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#26352D] line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-[#647067] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <Link
                href="/food"
                className="w-full py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Order on WhatsApp</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
