'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Calendar, Clock, ArrowRight, Tag, Briefcase, HeartPulse, Store } from 'lucide-react';
import { TODAY_ITEMS } from '../../data/mockData';
import { SectionHeader } from '../common/SectionHeader';

export const TodayInKorutla: React.FC = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'OFFER':
        return <Tag className="w-3.5 h-3.5 text-amber-600" />;
      case 'EVENT':
        return <Briefcase className="w-3.5 h-3.5 text-purple-600" />;
      case 'ANNOUNCEMENT':
        return <HeartPulse className="w-3.5 h-3.5 text-rose-600" />;
      case 'NEW_BUSINESS':
        return <Store className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Daily Updates"
        title="Today in Korutla"
        subtitle="Exclusive daily offers, hiring events, health camps, and new store arrivals happening today across town."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {TODAY_ITEMS.map((item) => (
          <div
            key={item.id}
            className="pastel-card pastel-card-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 group"
          >
            <div>
              {/* Image & Badge */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm">
                  {getTypeIcon(item.type)}
                  <span>{item.badgeText}</span>
                </div>

                <div className="absolute bottom-2 right-3 text-[11px] font-semibold text-white flex items-center gap-1 drop-shadow-sm">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{item.timeText}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <span className="text-[11px] font-bold text-purple-700 block mb-1">
                  {item.businessName}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="p-4 pt-0">
              <Link
                href={item.linkHref || '/'}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200/80 transition-colors"
              >
                <span>{item.linkText || 'View Details'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
