'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES, FEATURED_OFFERS } from '@/data/mockData';
import { Shirt, MapPin, Phone, MessageSquare, Tag, Star, Clock, ExternalLink, Search } from 'lucide-react';

export default function ShoppingPage() {
  const [selectedSub, setSelectedSub] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const shoppingShops = FEATURED_BUSINESSES.filter(
    (b) => b.categorySlug === 'shopping' || b.subCategory.toLowerCase().includes('textiles') || b.subCategory.toLowerCase().includes('wear') || b.subCategory.toLowerCase().includes('saree')
  );

  const subCategories = ['All', 'Wedding & Ethnic Wear', 'Pattu Sarees', 'Kids Wear', 'Footwear & Accessories'];

  const filteredShops = shoppingShops.filter((shop) => {
    const matchesSub = selectedSub === 'All' || shop.subCategory.toLowerCase().includes(selectedSub.toLowerCase());
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || shop.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSub && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-3xl pastel-card p-6 sm:p-8 border border-purple-200/80 bg-gradient-to-r from-purple-50 via-pink-50 to-white shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold mb-3">
                <Shirt className="w-3.5 h-3.5 text-purple-700" />
                <span>Korutla Shopping &amp; Apparel Hub</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Textile Showrooms, Sarees &amp; Fashion in <span className="gradient-text-royal">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Explore Kanchipuram Pattu sarees, wedding lehengas, men&apos;s suits, kids festival wear, and jewellery showrooms in Cloth Market, Korutla.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 'Sarees', 'Laxmi Textiles', 'Kids Wear'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedSub === sub
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Shopping Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="pastel-card pastel-card-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 bg-white shadow-xs group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image src={shop.image} alt={shop.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{shop.rating}</span>
                  </div>
                  {shop.isVerified && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
                      Verified Shop
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                    {shop.subCategory}
                  </span>
                  <Link href={`/businesses/${shop.id}`}>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {shop.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{shop.address}</span>
                  </p>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-emerald-700 font-semibold">{shop.timing}</span>
                  </p>

                  {shop.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                      {shop.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {shop.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-50 text-[10px] font-medium text-purple-800 border border-purple-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 grid grid-cols-3 gap-2 text-xs font-bold">
                <Link
                  href={`/businesses/${shop.id}`}
                  className="flex items-center justify-center py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-colors"
                >
                  View Shop
                </Link>
                <a
                  href={`tel:${shop.phone}`}
                  className="flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-700" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${(shop.whatsapp || shop.phone).replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>Chat</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
