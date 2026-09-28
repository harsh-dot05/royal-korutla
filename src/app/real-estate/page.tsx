'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PROPERTIES } from '@/data/mockData';
import { Home, MapPin, Phone, MessageSquare, Bed, Bath, Maximize2, Search } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="rounded-xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
                <Home className="w-3.5 h-3.5 text-blue-700" />
                <span>Korutla Real Estate</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Plots, Houses &amp; Properties in <span className="text-blue-700">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Browse residential plots, houses for rent, commercial space for lease, and agricultural land across Korutla town.
              </p>
            </div>

            {/* BUY / RENT / SELL Toggle */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-100 border border-slate-200 w-full md:w-auto">
              {(['All', 'Buy', 'Rent', 'Sell'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-colors ${
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

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search DTCP plot, house, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {['All', 'Plot', 'House', 'Commercial', 'Agriculture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">No property listings available matching your criteria.</p>
            <button
              onClick={() => { setActiveTab('All'); setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                className="rounded-xl overflow-hidden flex flex-col justify-between border border-slate-200 bg-white shadow-xs"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                    <Image
                      src={prop.images[0]}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-900 shadow-xs">
                      FOR {prop.type.toUpperCase()}
                    </div>

                    <div className="absolute bottom-3 left-3 text-sm font-extrabold text-white bg-slate-950/80 px-3 py-1 rounded-md">
                      {prop.price}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      {prop.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {prop.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{prop.location}</span>
                    </p>

                    {/* Specs */}
                    <div className="flex items-center gap-4 mt-3 py-2 border-y border-slate-100 text-xs text-slate-700 font-medium">
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-blue-700" />
                        {prop.areaSqft} sqft
                      </span>
                      {prop.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-blue-700" />
                          {prop.bedrooms} Bed
                        </span>
                      )}
                      {prop.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-blue-700" />
                          {prop.bathrooms} Bath
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {prop.features.slice(0, 3).map((feat, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-semibold text-blue-800 border border-blue-100">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${prop.ownerPhone}`}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors border border-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-700" />
                    <span>Call Owner</span>
                  </a>
                  {prop.whatsapp ? (
                    <a
                      href={`https://wa.me/${prop.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I am interested in property '${prop.title}' listed on Royal Korutla.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-bold text-white transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  ) : (
                    <button className="px-3 py-2 rounded-lg bg-blue-700 text-white font-bold text-xs">
                      Details
                    </button>
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
