'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, Tag, Briefcase, HeartPulse, Store, Info } from 'lucide-react';
import { TODAY_ITEMS } from '../../data/mockData';
import { SectionHeader } from '../common/SectionHeader';

export const TodayInKorutla: React.FC = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'OFFER':
        return <Tag className="w-3.5 h-3.5 text-[#E66A32]" />;
      case 'EVENT':
        return <Briefcase className="w-3.5 h-3.5 text-[#E66A32]" />;
      case 'ANNOUNCEMENT':
        return <HeartPulse className="w-3.5 h-3.5 text-[#E66A32]" />;
      case 'NEW_BUSINESS':
        return <Store className="w-3.5 h-3.5 text-[#E66A32]" />;
      default:
        return <Info className="w-3.5 h-3.5 text-[#E66A32]" />;
    }
  };

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Today in Korutla">
      <SectionHeader
        badge="Daily Updates"
        title="Today in Korutla"
        subtitle="Daily store offers, hiring events, health camps, and announcements in Korutla town."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TODAY_ITEMS.map((item) => (
          <div
            key={item.id}
            className="rounded-xl overflow-hidden flex flex-col justify-between border border-[#E8E5DF] bg-white shadow-xs hover:border-[#E66A32] transition-colors"
          >
            <div>
              {/* Image & Badge */}
              <div className="relative h-40 w-full overflow-hidden bg-[#FAF7F2] border-b border-[#E8E5DF]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                />

                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/95 border border-[#E8E5DF] text-xs font-bold text-[#26352D] flex items-center gap-1.5 shadow-xs">
                  {getTypeIcon(item.type)}
                  <span>{item.badgeText}</span>
                </div>

                <div className="absolute bottom-2 right-2.5 text-[10px] font-semibold text-white bg-[#1C2721]/85 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#E66A32]" />
                  <span>{item.timeText}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <span className="text-[11px] font-bold text-[#E66A32] block mb-1">
                  {item.businessName}
                </span>
                <h3 className="text-sm font-bold text-[#26352D] leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#647067] mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="p-4 pt-0">
              <Link
                href={item.linkHref || '/'}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#FFF6F0] hover:bg-[#FFEADA] text-xs font-bold text-[#E66A32] border border-[#F8CFBE] transition-colors"
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
