'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PROPERTIES } from '@/data/mockData';
import { Home, MapPin, Phone, MessageCircle, Bed, Bath, Maximize2, Search } from 'lucide-react';

export default function RealEstatePage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Buy' | 'Rent' | 'Sell'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = PROPERTIES.filter((prop) => {
    const matchesTab = activeTab === 'All' || (activeTab === 'Buy' && prop.type === 'Buy') || (activeTab === 'Rent' && prop.type === 'Rent') || (activeTab === 'Sell' && (prop.type === 'Lease' || prop.type === 'Sell'));
    const matchesCategory = selectedCategory === 'All' || prop.category === selectedCategory;
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || prop.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[#E8E5DF] bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold mb-3">
                <Home className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Korutla Real Estate</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Plots, Houses &amp; Properties in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] mt-2 max-w-xl leading-relaxed">
                Browse residential plots, houses for rent, commercial space for lease, and agricultural land across Korutla town and highway bypass.
              </p>
            </div>

            {/* BUY / RENT / SELL Toggle */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] w-full md:w-auto">
              {(['All', 'Buy', 'Rent', 'Sell'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
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

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#647067]" />
            <input
              type="text"
              placeholder="Search DTCP plot, house, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#26352D] placeholder-[#647067] focus:outline-none shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {['All', 'Plot', 'House', 'Commercial', 'Agriculture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#E66A32] text-white shadow-xs'
                    : 'bg-white text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-[#E8E5DF] p-8 space-y-4">
            <p className="text-sm font-semibold text-[#26352D]">No property listings available matching your criteria.</p>
            <button
              onClick={() => { setActiveTab('All'); setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                className="rounded-2xl overflow-hidden flex flex-col justify-between border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs transition-all"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#FAF7F2] border-b border-[#E8E5DF]">
                    <Image
                      src={prop.images[0]}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white border border-[#E8E5DF] text-xs font-bold text-[#26352D] shadow-xs">
                      FOR {prop.type.toUpperCase()}
                    </div>

                    <div className="absolute bottom-3 left-3 text-sm font-extrabold text-white bg-[#26352D]/90 px-3 py-1 rounded-lg">
                      {prop.price}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <span className="text-[10px] font-bold text-[#E66A32] uppercase tracking-wider block mb-1">
                      {prop.category}
                    </span>
                    <h3 className="text-base font-bold text-[#26352D] line-clamp-1">
                      {prop.title}
                    </h3>

                    <p className="text-xs text-[#647067] mt-2 flex items-center gap-1.5 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                      <span>{prop.location}</span>
                    </p>

                    {/* Specs */}
                    <div className="flex items-center gap-4 mt-3 py-2 border-y border-[#E8E5DF] text-xs text-[#26352D] font-medium">
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-[#E66A32]" />
                        {prop.areaSqft} sqft
                      </span>
                      {prop.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-[#E66A32]" />
                          {prop.bedrooms} Bed
                        </span>
                      )}
                      {prop.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-[#E66A32]" />
                          {prop.bathrooms} Bath
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {prop.features.slice(0, 3).map((feat, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-[#FFF6F0] text-[10px] font-semibold text-[#E66A32] border border-[#F8CFBE]">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2 text-xs font-bold">
                  <a
                    href={`tel:${prop.ownerPhone}`}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] transition-colors border border-[#E8E5DF]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                    <span>Call Owner</span>
                  </a>
                  {prop.whatsapp ? (
                    <a
                      href={`https://wa.me/${prop.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I am interested in property '${prop.title}' listed on Royal Korutla.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  ) : (
                    <a
                      href={`tel:${prop.ownerPhone}`}
                      className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-[#E66A32] text-white"
                    >
                      Enquire
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
