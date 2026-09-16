'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from '../common/SectionHeader';
import { Promotion } from '@/types';
import { PROMOTIONS as FALLBACK_PROMOTIONS, FEATURED_BUSINESSES } from '@/data/mockData';
import { Sparkles, Calendar, Tag, MapPin, Phone, MessageSquare, ExternalLink, ArrowRight } from 'lucide-react';

export const PromotionsSection: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPromotions() {
      try {
        const res = await fetch('/api/promotions');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPromotions(data.data);
        } else {
          setPromotions(FALLBACK_PROMOTIONS.filter(p => p.status === 'ACTIVE'));
        }
      } catch (e) {
        setPromotions(FALLBACK_PROMOTIONS.filter(p => p.status === 'ACTIVE'));
      } finally {
        setLoading(false);
      }
    }
    loadPromotions();
  }, []);

  if (!loading && promotions.length === 0) {
    return null;
  }

  return (
    <section id="promotions" className="py-12 bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-slate-50 border-y border-amber-200/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Paid Campaigns & Deals"
          title="Special Promotions &amp; Discounts 🏷️"
          subtitle="Exclusive deals, festival campaigns, and limited-time promotional offers published by Korutla store owners."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((prom) => {
            // Match business info for phone & whatsapp if available
            const matchingBiz = FEATURED_BUSINESSES.find(b => b.id === prom.businessId || b.name === prom.businessName);
            const phone = matchingBiz?.phone || '+91 98480 12345';
            const whatsapp = matchingBiz?.whatsapp || '+91 98480 12345';
            const location = matchingBiz?.address || 'Korutla Town';
            const category = matchingBiz?.subCategory || prom.placement || 'Special Promotion';
            const bannerImg = prom.bannerImage || matchingBiz?.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80';

            return (
              <div
                key={prom.id}
                className="pastel-card pastel-card-hover rounded-3xl overflow-hidden flex flex-col justify-between border border-amber-300/80 bg-white shadow-md relative group"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={bannerImg}
                      alt={prom.title || prom.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* SPONSORED Badge (Top Left - Mandatory for Paid Content) */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-slate-950" />
                        <span>SPONSORED</span>
                      </span>
                      {prom.badgeLabel && prom.badgeLabel !== 'PROMOTED' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-900/90 text-purple-200 font-extrabold text-[10px] border border-purple-700">
                          {prom.badgeLabel}
                        </span>
                      )}
                    </div>

                    {/* Expiry Badge (Top Right) */}
                    {prom.endDate && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-amber-500/40 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        <span>Valid till {prom.endDate}</span>
                      </div>
                    )}

                    {/* Offer Tag Overlay on Image */}
                    {prom.offerText && (
                      <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-amber-500/95 text-slate-950 text-xs font-black shadow-lg flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 fill-slate-950" />
                        <span className="truncate">{prom.offerText}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                      <span className="uppercase tracking-wider">{category}</span>
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{location}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 leading-snug group-hover:text-amber-700 transition-colors">
                      {prom.title || `${prom.businessName} Special Promotion`}
                    </h3>

                    <p className="text-xs font-bold text-purple-800">
                      By {prom.businessName}
                    </p>

                    {prom.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {prom.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href={`tel:${phone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-700" />
                      <span>Call Shop</span>
                    </a>

                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${prom.businessName}, I saw your promotion "${prom.title || prom.offerText || 'Offer'}" on Royal Korutla!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {matchingBiz && (
                    <Link
                      href={`/businesses/${matchingBiz.id}`}
                      className="w-full flex items-center justify-center gap-1 py-2 text-[11px] font-bold text-slate-600 hover:text-amber-700 transition-colors"
                    >
                      <span>View Full Business Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
