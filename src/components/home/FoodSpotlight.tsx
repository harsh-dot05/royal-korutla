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
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Korutla Food"
        title="Food &amp; Restaurant Menu"
        subtitle="Order biryani, starters, tiffins, and meals directly from Korutla restaurants."
        actionText="Explore Food Menu"
        actionHref="/food"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FOOD_MENU_ITEMS.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="rounded-xl overflow-hidden border border-slate-200 flex flex-col justify-between bg-white shadow-xs"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-200">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs border border-slate-200">
                  <Star className="w-3.5 h-3.5 fill-blue-700 text-blue-700" />
                  <span>{item.rating || 4.8}</span>
                </div>

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-blue-700 text-white font-bold text-xs shadow-xs">
                  ₹{item.price}
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">{foodBiz.name}</span>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <Link
                href="/food"
                className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
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
