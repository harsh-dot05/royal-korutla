'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_OFFERS, PROMOTIONS as FALLBACK_PROMOTIONS, FEATURED_BUSINESSES } from '@/data/mockData';
import { Offer, Promotion } from '@/types';
import { Tag, Calendar, MapPin, Phone, MessageCircle, Copy, Check, Search, ArrowRight } from 'lucide-react';
import {
  getRoyalKorutlaWhatsAppUrl,
  WHATSAPP_PREFILLED_MESSAGES,
  ROYAL_KORUTLA_PHONE_DISPLAY,
} from '@/config/contact';

export default function OffersPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Store Deals' | 'Promotional Campaigns'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadPromotions() {
      try {
        const res = await fetch('/api/promotions');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPromotions(data.data);
        } else {
          setPromotions(FALLBACK_PROMOTIONS.filter((p) => p.status === 'ACTIVE'));
        }
      } catch (e) {
        setPromotions(FALLBACK_PROMOTIONS.filter((p) => p.status === 'ACTIVE'));
      } finally {
        setLoading(false);
      }
    }
    loadPromotions();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredOffers = FEATURED_OFFERS.filter((off) => {
    const matchesTab = activeTab === 'All' || activeTab === 'Store Deals';
    const matchesSearch =
      off.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (off.code && off.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      off.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const filteredPromotions = promotions.filter((prom) => {
    const matchesTab = activeTab === 'All' || activeTab === 'Promotional Campaigns';
    const matchesSearch =
      (prom.title && prom.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prom.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prom.offerText && prom.offerText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const totalResults = (activeTab === 'Promotional Campaigns' ? 0 : filteredOffers.length) + (activeTab === 'Store Deals' ? 0 : filteredPromotions.length);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[#E8E5DF] bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold mb-3">
                <Tag className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Korutla Store Offers &amp; Discounts</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Offers &amp; Promotions in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] mt-2 max-w-xl leading-relaxed">
                Browse exclusive store discounts, festival sales, and promotional campaigns published by verified Korutla merchants.
              </p>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] w-full md:w-auto">
              {(['All', 'Store Deals', 'Promotional Campaigns'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                    activeTab === tab
                      ? 'bg-[#E66A32] text-white shadow-xs'
                      : 'text-[#647067] hover:text-[#26352D]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#647067]" />
          <input
            type="text"
            placeholder="Search deals, coupons, store name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#26352D] placeholder-[#647067] focus:outline-none shadow-xs"
          />
        </div>

        {/* Empty State */}
        {totalResults === 0 && !loading ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-[#E8E5DF] p-8 space-y-4">
            <p className="text-sm font-semibold text-[#26352D]">No offers or promotions match your search criteria.</p>
            <button
              onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Section 1: Store Deals & Coupons */}
            {(activeTab === 'All' || activeTab === 'Store Deals') && filteredOffers.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-[#26352D] flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#E66A32]" />
                    <span>Active Store Deals &amp; Coupons</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredOffers.map((offer: Offer) => (
                    <div
                      key={offer.id}
                      className="rounded-2xl p-5 border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-lg bg-[#E66A32] text-white text-xs font-bold shadow-2xs">
                            {offer.discount}
                          </span>
                          <span className="text-[11px] font-semibold text-[#647067]">{offer.expiry}</span>
                        </div>

                        <h3 className="text-base font-bold text-[#26352D] leading-snug">
                          {offer.title}
                        </h3>
                        <p className="text-xs text-[#E66A32] font-bold mt-1">
                          At: {offer.businessName} ({offer.location})
                        </p>
                      </div>

                      {/* Coupon Code Section */}
                      <div className="mt-5 pt-4 border-t border-[#E8E5DF] flex items-center justify-between">
                        {offer.code ? (
                          <div className="flex items-center justify-between w-full p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E5DF]">
                            <span className="font-mono text-xs font-bold text-[#26352D] tracking-wider">
                              {offer.code}
                            </span>
                            <button
                              onClick={() => handleCopyCode(offer.code!)}
                              className="p-1.5 text-xs font-bold text-[#E66A32] hover:text-[#D45B25] flex items-center gap-1"
                            >
                              {copiedCode === offer.code ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#E66A32]" />
                                  <span className="text-[#E66A32] text-[10px]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">Copy Code</span>
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[#647067] italic">No code required - Show offer at store</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 2: Promotional Campaigns */}
            {(activeTab === 'All' || activeTab === 'Promotional Campaigns') && filteredPromotions.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-[#26352D] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#E66A32]" />
                    <span>Sponsored Campaigns &amp; Promotions</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPromotions.map((prom: Promotion) => {
                    const matchingBiz = FEATURED_BUSINESSES.find((b) => b.id === prom.businessId || b.name === prom.businessName);
                    const phone = matchingBiz?.phone || '+91 98480 12345';
                    const whatsapp = matchingBiz?.whatsapp || '+91 98480 12345';
                    const location = matchingBiz?.address || 'Korutla Town';
                    const category = matchingBiz?.subCategory || prom.placement || 'Special Promotion';
                    const bannerImg = prom.bannerImage || matchingBiz?.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80';

                    return (
                      <div
                        key={prom.id}
                        className="rounded-2xl overflow-hidden flex flex-col justify-between border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs transition-all"
                      >
                        <div>
                          {/* Image Container */}
                          <div className="relative h-48 w-full overflow-hidden bg-[#FAF7F2] border-b border-[#E8E5DF]">
                            <Image
                              src={bannerImg}
                              alt={prom.title || prom.businessName}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />

                            {/* SPONSORED Badge */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                              <span className="px-2.5 py-1 rounded-md bg-[#E66A32] text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
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
                              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white text-[#26352D] text-[10px] font-bold border border-[#E8E5DF] flex items-center gap-1 shadow-xs">
                                <Calendar className="w-3 h-3 text-[#E66A32]" />
                                <span>Valid till {prom.endDate}</span>
                              </div>
                            )}

                            {/* Offer Text */}
                            {prom.offerText && (
                              <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-[#26352D] text-white text-xs font-bold shadow-xs flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5 text-[#E66A32]" />
                                <span className="truncate">{prom.offerText}</span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#E66A32]">
                              <span className="uppercase tracking-wider">{category}</span>
                              <span className="flex items-center gap-1 text-[#647067] font-medium">
                                <MapPin className="w-3 h-3 text-[#647067]" />
                                <span>{location}</span>
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-[#26352D] leading-snug">
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
                        <div className="p-5 pt-0 space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                            <a
                              href={`tel:${phone}`}
                              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] border border-[#E8E5DF] transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                              <span>Call</span>
                            </a>

                            <a
                              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${prom.businessName}, I saw your promotion "${prom.title || prom.offerText || 'Offer'}" on Royal Korutla!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>

                          {matchingBiz && (
                            <Link
                              href={`/businesses/${matchingBiz.id}`}
                              className="w-full flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold text-[#E66A32] hover:underline transition-colors"
                            >
                              <span>View Store Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Merchant Promotional Enquiry Card */}
        <div className="rounded-2xl p-6 bg-white border border-[#E8E5DF] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#26352D] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#E66A32]" />
              <span>Want to Publish Deals or Festival Offers for Your Store?</span>
            </h3>
            <p className="text-xs text-[#647067]">
              Put your discounts in front of thousands of local shoppers in Korutla. Contact Royal Korutla advertising team on WhatsApp.
            </p>
          </div>
          <a
            href={getRoyalKorutlaWhatsAppUrl(WHATSAPP_PREFILLED_MESSAGES.promotionsAdvertising)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-xs transition-colors"
            aria-label={`Advertise on Royal Korutla on WhatsApp ${ROYAL_KORUTLA_PHONE_DISPLAY}`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Advertise on WhatsApp ({ROYAL_KORUTLA_PHONE_DISPLAY})</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
