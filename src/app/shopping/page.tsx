'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES } from '@/data/mockData';
import { Shirt, MapPin, Phone, MessageSquare, Star, Clock, Search } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
                <Shirt className="w-3.5 h-3.5 text-blue-700" />
                <span>Korutla Shopping &amp; Apparel</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Textile Showrooms, Sarees &amp; Fashion in <span className="text-blue-700">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Find silk sarees, wedding wear, men&apos;s apparel, kids wear, and jewelry showrooms in Cloth Market, Korutla.
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
              placeholder="Search sarees, textiles, kids wear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedSub === sub
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Shopping Cards Grid */}
        {filteredShops.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">No shopping listings match your search criteria.</p>
            <button
              onClick={() => { setSelectedSub('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="rounded-xl overflow-hidden flex flex-col justify-between border border-slate-200 bg-white shadow-xs"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                    <Image src={shop.image} alt={shop.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-blue-700 text-blue-700" />
                      <span>{shop.rating}</span>
                    </div>
                    {shop.isVerified && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[10px] font-bold shadow-xs">
                        Verified Shop
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                      {shop.subCategory}
                    </span>
                    <Link href={`/businesses/${shop.id}`}>
                      <h3 className="text-base font-bold text-slate-900 hover:text-blue-700 transition-colors">
                        {shop.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{shop.address}</span>
                    </p>

                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-700 font-medium">{shop.timing}</span>
                    </p>

                    {shop.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                        {shop.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {shop.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-semibold text-blue-800 border border-blue-100">
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
                    className="flex items-center justify-center py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors"
                  >
                    Details
                  </Link>
                  <a
                    href={`tel:${shop.phone}`}
                    className="flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-700" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${(shop.whatsapp || shop.phone).replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </a>
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
