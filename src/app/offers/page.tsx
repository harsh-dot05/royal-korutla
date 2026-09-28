'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_OFFERS, PROMOTIONS as FALLBACK_PROMOTIONS, FEATURED_BUSINESSES } from '@/data/mockData';
import { Offer, Promotion } from '@/types';
import { Tag, Calendar, MapPin, Phone, MessageSquare, Copy, Check, Search, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <div className="rounded-xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
                <Tag className="w-3.5 h-3.5 text-blue-700" />
                <span>Korutla Store Offers &amp; Discounts</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Offers &amp; Promotions in <span className="text-blue-700">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Browse store discounts, festival sales, coupon codes, and promotional campaigns published by Korutla business owners.
              </p>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-100 border border-slate-200 w-full md:w-auto">
              {(['All', 'Store Deals', 'Promotional Campaigns'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2 rounded-md text-xs font-bold transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search deals, coupons, business name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 shadow-xs"
          />
        </div>

        {/* Empty State */}
        {totalResults === 0 && !loading ? (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">No offers or promotions match your search criteria.</p>
            <button
              onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
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
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-700" />
                    <span>Active Store Deals &amp; Coupons</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredOffers.map((offer: Offer) => (
                    <div
                      key={offer.id}
                      className="rounded-xl p-5 border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-md bg-blue-700 text-white text-xs font-bold">
                            {offer.discount}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">{offer.expiry}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {offer.title}
                        </h3>
                        <p className="text-xs text-blue-700 font-bold mt-1">
                          At: {offer.businessName} ({offer.location})
                        </p>
                      </div>

                      {/* Coupon Code Section */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        {offer.code ? (
                          <div className="flex items-center justify-between w-full p-2 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                              {offer.code}
                            </span>
                            <button
                              onClick={() => handleCopyCode(offer.code!)}
                              className="p-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                            >
                              {copiedCode === offer.code ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-blue-700" />
                                  <span className="text-blue-700 text-[10px]">Copied</span>
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
                          <span className="text-xs text-slate-500 italic">No code required - Show offer at store</span>
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
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-700" />
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
                        className="rounded-xl overflow-hidden flex flex-col justify-between border border-slate-200 bg-white shadow-xs"
                      >
                        <div>
                          {/* Image Container */}
                          <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                            <Image
                              src={bannerImg}
                              alt={prom.title || prom.businessName}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
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
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
