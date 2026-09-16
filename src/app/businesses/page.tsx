'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES, CATEGORIES } from '@/data/mockData';
import { Building2, Search, Star, MapPin, Phone, MessageSquare, Clock, CheckCircle2, Sparkles } from 'lucide-react';

export default function BusinessesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBusinesses = FEATURED_BUSINESSES.filter((biz) => {
    const matchesCategory = selectedCategory === 'All' || biz.categorySlug === selectedCategory;
    const matchesSearch =
      biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-3xl pastel-card p-6 sm:p-8 border border-indigo-200/80 bg-gradient-to-r from-indigo-50 via-purple-50 to-white shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-800 text-xs font-bold mb-3">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Korutla Local Directory</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                All Verified Businesses in <span className="text-indigo-600">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Discover shopkeepers, showrooms, service providers, hardware stores, diagnostic centers, and local establishments.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search business name, area, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Business Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => (
            <div
              key={biz.id}
              className="pastel-card pastel-card-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-100 bg-white shadow-sm group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={biz.image}
                    alt={biz.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-bold text-amber-700 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{biz.rating}</span>
                    <span className="text-slate-500 text-[10px]">({biz.reviewCount})</span>
                  </div>

                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {biz.promotionLabel && (
                      <div className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/20">
                        <Sparkles className="w-3 h-3 fill-white" />
                        <span>{biz.promotionLabel}</span>
                      </div>
                    )}
                    {biz.isVerified && (
                      <div className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[10px] font-bold text-emerald-800 flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                    {biz.subCategory}
                  </span>
                  <Link href={`/businesses/${biz.id}`}>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {biz.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{biz.address}</span>
                  </p>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-emerald-700 font-medium">{biz.timing}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${biz.phone}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Call</span>
                </a>
                <Link
                  href={`/businesses/${biz.id}`}
                  className="flex items-center justify-center px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-colors shadow-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
