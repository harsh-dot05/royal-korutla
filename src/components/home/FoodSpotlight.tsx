'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from '../common/SectionHeader';
import { FOOD_MENU_ITEMS, FEATURED_BUSINESSES } from '../../data/mockData';
import { Utensils, Star, ArrowRight, MessageSquare } from 'lucide-react';

export const FoodSpotlight: React.FC = () => {
  const foodBiz = FEATURED_BUSINESSES.find((b) => b.categorySlug === 'food') || FEATURED_BUSINESSES[0];

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Korutla Flavors"
        title="Food &amp; Restaurant Specials"
        subtitle="Order authentic Hyderabadi Dum Biryani, starters, tiffins, and family buckets delivered directly on WhatsApp."
        actionText="Explore Full Food Menu"
        actionHref="/food"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FOOD_MENU_ITEMS.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="pastel-card pastel-card-hover rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between group bg-white shadow-xs"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{item.rating || 4.8}</span>
                </div>

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-sm">
                  ₹{item.price}
                </div>
              </div>

              <div className="p-5 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">{foodBiz.name}</span>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-purple-700 transition-colors">
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
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>Order on WhatsApp</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
