'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES, CATEGORIES } from '@/data/mockData';
import { Building2, Search, Star, MapPin, Phone, Clock, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[#E8E5DF] bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold mb-3">
                <Building2 className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Korutla Local Directory</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                All Verified Businesses in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] mt-2 max-w-xl font-normal leading-relaxed">
                Discover verified shopkeepers, textile showrooms, healthcare centers, supermarkets, repair workshops, and local merchants across Korutla town.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#647067]" />
            <input
              type="text"
              placeholder="Search business name, area, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#26352D] placeholder-[#647067] focus:outline-none shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-[#E66A32] text-white shadow-xs'
                  : 'bg-white text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-[#E66A32] text-white shadow-xs'
                    : 'bg-white text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
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
              className="rounded-2xl overflow-hidden flex flex-col justify-between border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs transition-all group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[#FAF7F2] border-b border-[#E8E5DF]">
                  <Image
                    src={biz.image}
                    alt={biz.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white border border-[#E8E5DF] text-xs font-bold text-[#26352D] flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-[#E66A32] text-[#E66A32]" />
                    <span>{biz.rating}</span>
                    <span className="text-[#647067] text-[10px]">({biz.reviewCount})</span>
                  </div>

                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {biz.promotionLabel && (
                      <div className="px-2.5 py-0.5 rounded-md bg-[#E66A32] text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3 fill-white" />
                        <span>{biz.promotionLabel}</span>
                      </div>
                    )}
                    {biz.isVerified && (
                      <div className="px-2 py-0.5 rounded-md bg-[#26352D] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-[#E66A32]" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-bold text-[#E66A32] uppercase tracking-wider block">
                    {biz.subCategory}
                  </span>
                  <Link href={`/businesses/${biz.id}`}>
                    <h3 className="text-base font-bold text-[#26352D] line-clamp-1 group-hover:text-[#E66A32] transition-colors">
                      {biz.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#647067] flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                    <span>{biz.address}</span>
                  </p>

                  <p className="text-xs text-[#647067] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#647067] shrink-0" />
                    <span className="text-[#26352D] font-medium">{biz.timing}</span>
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 grid grid-cols-2 gap-2 text-xs font-bold">
                <a
                  href={`tel:${biz.phone}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] border border-[#E8E5DF] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                  <span>Call</span>
                </a>
                <Link
                  href={`/businesses/${biz.id}`}
                  className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white transition-colors shadow-xs"
                >
                  <span>View Details</span>
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
