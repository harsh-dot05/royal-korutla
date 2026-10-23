'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES } from '@/data/mockData';
import { ShoppingBag, MapPin, Phone, MessageCircle, Star, Clock, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ShoppingPage() {
  const [selectedSub, setSelectedSub] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const shoppingShops = FEATURED_BUSINESSES.filter(
    (b) =>
      b.categorySlug === 'shopping' ||
      b.tags.some((t) => ['shopping', 'footwear', 'watches', 'retail', 'accessories'].includes(t.toLowerCase()))
  );

  const subCategories = ['All', 'Footwear & Watches', 'Jewellery', 'Electronics & Mobiles', 'General Stores'];

  const filteredShops = shoppingShops.filter((shop) => {
    const matchesSub = selectedSub === 'All' || shop.subCategory.toLowerCase().includes(selectedSub.toLowerCase()) || shop.tags.some(t => t.toLowerCase().includes(selectedSub.toLowerCase()));
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || shop.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSub && matchesSearch;
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
                <ShoppingBag className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Korutla Shopping &amp; Retail</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Shopping, Footwear &amp; Retail Showrooms in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] mt-2 max-w-2xl leading-relaxed">
                Find branded footwear, watches, jewelry, electronics, and daily retail showrooms in Old Bus Stand Road and Gandhi Road, Korutla.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#647067]" />
            <input
              type="text"
              placeholder="Search footwear, watches, retail shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#26352D] placeholder-[#647067] focus:outline-none shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedSub === sub
                    ? 'bg-[#E66A32] text-white shadow-xs'
                    : 'bg-white text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Shopping Cards Grid */}
        {filteredShops.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-[#E8E5DF] p-8 space-y-4">
            <p className="text-sm font-semibold text-[#26352D]">No shopping listings match your search criteria.</p>
            <p className="text-xs text-[#647067]">Try searching for other items or reset your filters.</p>
            <button
              onClick={() => { setSelectedSub('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="rounded-2xl overflow-hidden flex flex-col justify-between border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs transition-all"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-[#FAF7F2] border-b border-[#E8E5DF]">
                    <Image src={shop.image} alt={shop.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white border border-[#E8E5DF] text-xs font-bold text-[#26352D] flex items-center gap-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-[#E66A32] text-[#E66A32]" />
                      <span>{shop.rating}</span>
                    </div>
                    {shop.isVerified && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#26352D] text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#E66A32]" />
                        <span>Verified Store</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2.5">
                    <span className="text-[11px] font-bold text-[#E66A32] uppercase tracking-wider block">
                      {shop.subCategory}
                    </span>
                    <Link href={`/businesses/${shop.id}`}>
                      <h3 className="text-base font-bold text-[#26352D] hover:text-[#E66A32] transition-colors">
                        {shop.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#647067] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                      <span>{shop.address}</span>
                    </p>

                    <p className="text-xs text-[#647067] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#647067] shrink-0" />
                      <span className="text-[#26352D] font-medium">{shop.timing}</span>
                    </p>

                    {shop.description && (
                      <p className="text-xs text-[#647067] line-clamp-2 leading-relaxed pt-1">
                        {shop.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {shop.tags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-[#FFF6F0] text-[10px] font-semibold text-[#E66A32] border border-[#F8CFBE]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 pt-0 grid grid-cols-3 gap-2 text-xs font-bold">
                  <Link
                    href={`/businesses/${shop.id}`}
                    className="flex items-center justify-center py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#26352D] border border-[#E8E5DF] transition-colors"
                  >
                    <span>Details</span>
                  </Link>
                  <a
                    href={`tel:${shop.phone}`}
                    className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] border border-[#E8E5DF] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${(shop.whatsapp || shop.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${shop.name}, I am contacting you via Royal Korutla.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
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
