'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SectionHeader } from '../common/SectionHeader';
import { Promotion } from '@/types';
import { PROMOTIONS as FALLBACK_PROMOTIONS, FEATURED_BUSINESSES } from '@/data/mockData';
import { Calendar, Tag, MapPin, Phone, MessageSquare, ArrowRight } from 'lucide-react';

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

  return (
    <section id="promotions" className="py-10 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Paid Campaigns & Deals"
          title="Special Promotions &amp; Offers"
          subtitle="Deals, festival campaigns, and promotional offers published by Korutla store owners. Clearly labeled sponsored content."
        />

        {!loading && promotions.length === 0 ? (
          <div className="py-8 text-center bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">No promotions available.</p>
            <Link
              href="/food"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
            >
              Explore Businesses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((prom) => {
              const matchingBiz = FEATURED_BUSINESSES.find(b => b.id === prom.businessId || b.name === prom.businessName);
              const phone = matchingBiz?.phone || '+91 98480 12345';
              const whatsapp = matchingBiz?.whatsapp || '+91 98480 12345';
              const location = matchingBiz?.address || 'Korutla Town';
              const category = matchingBiz?.subCategory || prom.placement || 'Special Promotion';
              const bannerImg = prom.bannerImage || matchingBiz?.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80';

              return (
                <div
                  key={prom.id}
                  className="rounded-xl overflow-hidden flex flex-col justify-between border border-slate-200 bg-white shadow-xs"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                      <img
                        src={bannerImg}
                        alt={prom.title || prom.businessName}
                        className="w-full h-full object-cover"
                      />

                      {/* SPONSORED Badge */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                        <span className="px-2.5 py-1 rounded-md bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
                          SPONSORED
                        </span>
                        {prom.badgeLabel && prom.badgeLabel !== 'PROMOTED' && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-semibold text-[10px]">
                            {prom.badgeLabel}
                          </span>
                        )}
                      </div>

                      {/* Expiry Badge */}
                      {prom.endDate && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white text-slate-800 text-[10px] font-bold border border-slate-200 flex items-center gap-1 shadow-xs">
                          <Calendar className="w-3 h-3 text-blue-700" />
                          <span>Valid till {prom.endDate}</span>
                        </div>
                      )}

                      {/* Offer Text */}
                      {prom.offerText && (
                        <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          <span className="truncate">{prom.offerText}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-blue-700">
                        <span className="uppercase tracking-wider">{category}</span>
                        <span className="flex items-center gap-1 text-slate-500 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{location}</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {prom.title || `${prom.businessName} Special Promotion`}
                      </h3>

                      <p className="text-xs font-semibold text-slate-700">
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
                  <div className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <a
                        href={`tel:${phone}`}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-700" />
                        <span>Call</span>
                      </a>

                      <a
                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${prom.businessName}, I saw your promotion "${prom.title || prom.offerText || 'Offer'}" on Royal Korutla!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {matchingBiz && (
                      <Link
                        href={`/businesses/${matchingBiz.id}`}
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold text-blue-700 hover:text-blue-800 transition-colors"
                      >
                        <span>View Business Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
