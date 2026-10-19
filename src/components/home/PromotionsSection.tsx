'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader } from '../common/SectionHeader';
import { Promotion } from '@/types';
import { PROMOTIONS as FALLBACK_PROMOTIONS, FEATURED_BUSINESSES } from '@/data/mockData';
import { Calendar, Tag, MapPin, Phone, MessageSquare, ArrowRight, MessageCircle } from 'lucide-react';
import {
  getRoyalKorutlaWhatsAppUrl,
  WHATSAPP_PREFILLED_MESSAGES,
  ROYAL_KORUTLA_PHONE_DISPLAY,
} from '@/config/contact';

export const PromotionsSection: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPromotions() {
      try {
        const res = await fetch('/api/promotions');
        const data = await res.json();
        if (isMounted) {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setPromotions(data.data);
          } else {
            setPromotions(FALLBACK_PROMOTIONS.filter((p) => p.status === 'ACTIVE'));
          }
        }
      } catch {
        if (isMounted) {
          setPromotions(FALLBACK_PROMOTIONS.filter((p) => p.status === 'ACTIVE'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadPromotions();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="promotions" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Store Promotions">
      <SectionHeader
        badge="Campaigns &amp; Offers"
        title="Promotions &amp; Store Deals"
        subtitle="Deals, festival campaigns, and promotional offers published by Korutla store owners. Clearly labeled sponsored content."
      />

      {!loading && promotions.length === 0 ? (
        <div className="py-8 text-center bg-white rounded-xl border border-[#E8E5DF] p-6 shadow-xs">
          <p className="text-xs sm:text-sm font-semibold text-[#647067] mb-3">No active promotions available at the moment.</p>
          <Link
            href="/businesses"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors shadow-xs"
          >
            Explore Businesses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {promotions.map((prom) => {
            const matchingBiz = FEATURED_BUSINESSES.find(
              (b) => b.id === prom.businessId || b.name === prom.businessName
            );
            const phone = matchingBiz?.phone || '+91 98480 12345';
            const whatsapp = matchingBiz?.whatsapp || '+91 98480 12345';
            const location = matchingBiz?.address || 'Korutla Town';
            const category = matchingBiz?.subCategory || prom.placement || 'Special Promotion';
            const bannerImg =
              prom.bannerImage ||
              matchingBiz?.image ||
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80';

            return (
              <div
                key={prom.id}
                className="rounded-xl overflow-hidden flex flex-col justify-between border border-[#E8E5DF] bg-white shadow-xs hover:border-[#E66A32] transition-colors"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#FAF7F2] border-b border-[#E8E5DF]">
                    <Image
                      src={bannerImg}
                      alt={prom.title || prom.businessName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />

                    {/* SPONSORED Badge */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      <span className="px-2 py-0.5 rounded-md bg-[#E66A32] text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
                        SPONSORED
                      </span>
                      {prom.badgeLabel && prom.badgeLabel !== 'PROMOTED' && (
                        <span className="px-2 py-0.5 rounded-md bg-[#26352D] text-white font-semibold text-[10px]">
                          {prom.badgeLabel}
                        </span>
                      )}
                    </div>

                    {/* Expiry Badge */}
                    {prom.endDate && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white text-[#26352D] text-[10px] font-bold border border-[#E8E5DF] flex items-center gap-1 shadow-xs">
                        <Calendar className="w-3 h-3 text-[#E66A32]" />
                        <span>Valid till {prom.endDate}</span>
                      </div>
                    )}

                    {/* Offer Text */}
                    {prom.offerText && (
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1.5 rounded-lg bg-[#E66A32] text-white text-xs font-bold shadow-xs flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <span className="truncate">{prom.offerText}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#E66A32]">
                      <span className="uppercase tracking-wider">{category}</span>
                      <span className="flex items-center gap-1 text-[#647067] font-medium">
                        <MapPin className="w-3 h-3 text-[#8A968D]" />
                        <span className="truncate max-w-[120px]">{location}</span>
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#26352D] leading-snug">
                      {prom.title || `${prom.businessName} Special Promotion`}
                    </h3>

                    <p className="text-xs font-semibold text-[#647067]">
                      By {prom.businessName}
                    </p>

                    {prom.description && (
                      <p className="text-xs text-[#647067] line-clamp-2 leading-relaxed">
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
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE7] text-[#26352D] font-bold border border-[#E8E5DF] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#26352D]" />
                      <span>Call</span>
                    </a>

                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hi ${prom.businessName}, I saw your promotion "${prom.title || prom.offerText || 'Offer'}" on Royal Korutla!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {matchingBiz && (
                    <Link
                      href={`/businesses/${matchingBiz.id}`}
                      className="w-full flex items-center justify-center gap-1 py-1 text-xs font-bold text-[#E66A32] hover:text-[#D45B25] transition-colors"
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

      {/* Merchant Promotional Enquiry Card */}
      <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-[#26352D] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#E66A32]" />
            <span>Are you a Korutla Business Owner? Feature Your Promotions Here</span>
          </h3>
          <p className="text-xs text-[#647067]">
            Reach verified local shoppers across Korutla. Publish your festival campaigns and digital store banners on Royal Korutla.
          </p>
        </div>
        <a
          href={getRoyalKorutlaWhatsAppUrl(WHATSAPP_PREFILLED_MESSAGES.promotionsAdvertising)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-xs transition-colors"
          aria-label={`Enquire for Store Promotion on WhatsApp ${ROYAL_KORUTLA_PHONE_DISPLAY}`}
        >
          <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
          <span>Enquire on WhatsApp ({ROYAL_KORUTLA_PHONE_DISPLAY})</span>
        </a>
      </div>
    </section>
  );
};
