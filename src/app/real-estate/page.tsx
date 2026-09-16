'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PROPERTIES } from '@/data/mockData';
import { Home, MapPin, Phone, MessageSquare, Tag, CheckCircle2, Bed, Bath, Maximize2, Search } from 'lucide-react';

export default function RealEstatePage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Buy' | 'Rent' | 'Lease'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = PROPERTIES.filter((prop) => {
    const matchesTab = activeTab === 'All' || prop.type === activeTab;
    const matchesCategory = selectedCategory === 'All' || prop.category === selectedCategory;
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || prop.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl pastel-card p-6 sm:p-8 border border-amber-200/80 bg-gradient-to-r from-amber-50 via-orange-50 to-white shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
                <Home className="w-3.5 h-3.5 text-amber-700" />
                <span>Korutla Real Estate &amp; Rentals</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Plots, Houses &amp; Shops in <span className="text-amber-700">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Browse verified residential plots, houses for rent, commercial space for lease, and agricultural land across Korutla town.
              </p>
            </div>

            {/* Buy / Rent / Lease toggle */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 w-full md:w-auto shadow-sm">
              {(['All', 'Buy', 'Rent', 'Lease'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
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
              placeholder="Search 'DTCP Plot', '2 BHK House', 'Metpally Road'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {['All', 'Plot', 'House', 'Commercial', 'Agriculture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-100 border border-amber-300 text-amber-900'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="pastel-card pastel-card-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-100 bg-white shadow-sm group"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={prop.images[0]}
                    alt={prop.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-bold text-amber-800 shadow-sm">
                    FOR {prop.type.toUpperCase()}
                  </div>

                  <div className="absolute bottom-3 left-3 text-lg font-black text-white bg-slate-900/80 px-3 py-1 rounded-xl backdrop-blur-sm">
                    {prop.price}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block mb-1">
                    {prop.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-amber-700">
                    {prop.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{prop.location}</span>
                  </p>

                  {/* Specs */}
                  <div className="flex items-center gap-4 mt-3 py-2 border-y border-slate-100 text-xs text-slate-700 font-medium">
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                      {prop.areaSqft} sqft
                    </span>
                    {prop.bedrooms && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-amber-600" />
                        {prop.bedrooms} Bed
                      </span>
                    )}
                    {prop.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-amber-600" />
                        {prop.bathrooms} Bath
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {prop.features.slice(0, 3).map((feat, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-50 text-[10px] font-medium text-amber-900 border border-amber-100">
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
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Call Owner</span>
                </a>
                {prop.whatsapp ? (
                  <a
                    href={`https://wa.me/${prop.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I am interested in property '${prop.title}' listed on Royal Korutla.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-300 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <button className="px-3 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-sm">
                    Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
