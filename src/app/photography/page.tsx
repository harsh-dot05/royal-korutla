'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PHOTOGRAPHY_BUSINESSES } from '@/data/mockData';
import { PhotographyBusiness, PhotographyType } from '@/types';
import { Camera, MapPin, Phone, MessageCircle, Clock, Search, CheckCircle2, Globe, X, Image as ImageIcon } from 'lucide-react';

export default function PhotographyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedGallery, setSelectedGallery] = useState<PhotographyBusiness | null>(null);

  const photographyTypes: (string | PhotographyType)[] = [
    'All',
    'Wedding',
    'Pre-wedding',
    'Birthday',
    'Events',
    'Portrait',
    'Product Photography',
    'Video',
    'Reels',
  ];

  const filteredStudios = PHOTOGRAPHY_BUSINESSES.filter((studio) => {
    const matchesType = selectedType === 'All' || studio.photographyTypes.includes(selectedType as PhotographyType);
    const matchesSearch =
      studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studio.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studio.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
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
                <Camera className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Korutla Photography &amp; Studios</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Wedding &amp; Event Photographers in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] mt-2 max-w-xl leading-relaxed">
                Find top photography studios in Korutla for wedding films, pre-wedding shoots, birthday celebrations, portraits, and video reels.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Photography Types Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#647067]" />
            <input
              type="text"
              placeholder="Search studio name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#26352D] placeholder-[#647067] focus:outline-none shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {photographyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-[#E66A32] text-white shadow-xs'
                    : 'bg-white text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Cards Grid */}
        {filteredStudios.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-[#E8E5DF] p-8 space-y-4">
            <p className="text-sm font-semibold text-[#26352D]">No photography studios match your search.</p>
            <button
              onClick={() => { setSelectedType('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudios.map((studio) => (
              <div
                key={studio.id}
                className="rounded-2xl overflow-hidden flex flex-col justify-between border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs transition-all"
              >
                <div>
                  {/* Cover Image & Profile Avatar */}
                  <div className="relative h-44 w-full bg-[#FAF7F2] border-b border-[#E8E5DF]">
                    <Image
                      src={studio.coverImage}
                      alt={studio.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      {studio.isFeatured && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#E66A32] text-white font-bold text-[10px] uppercase shadow-xs">
                          Featured Studio
                        </span>
                      )}
                      {studio.isVerified && (
                        <span className="px-2 py-0.5 rounded-md bg-[#26352D] text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#E66A32]" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    {/* Starting Price Badge */}
                    {studio.startingPrice && (
                      <div className="absolute bottom-3 right-3 text-xs font-extrabold text-white bg-[#26352D]/90 px-2.5 py-1 rounded-md">
                        {studio.startingPrice}
                      </div>
                    )}
                  </div>

                  {/* Profile Header & Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#E8E5DF] shrink-0 bg-[#FAF7F2]">
                        <Image src={studio.profileImage} alt={studio.name} fill sizes="48px" className="object-cover" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-base font-bold text-[#26352D] leading-snug">{studio.name}</h3>
                        <p className="text-xs text-[#647067] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                          <span className="line-clamp-1">{studio.location}</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#647067] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#647067] shrink-0" />
                      <span className="text-[#26352D] font-medium">{studio.openingHours}</span>
                    </p>

                    <p className="text-xs text-[#647067] line-clamp-2 leading-relaxed">
                      {studio.description}
                    </p>

                    {/* Photography Type Tags */}
                    <div>
                      <span className="text-[10px] font-bold text-[#647067] uppercase tracking-wider block mb-1">Services Offered:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {studio.photographyTypes.map((type, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-md bg-[#FFF6F0] text-[10px] font-semibold text-[#E66A32] border border-[#F8CFBE]">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <a
                      href={`tel:${studio.phone}`}
                      className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] transition-colors border border-[#E8E5DF]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                      <span>Call Studio</span>
                    </a>

                    {studio.whatsapp ? (
                      <a
                        href={`https://wa.me/${studio.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${studio.name}, I found your studio on Royal Korutla. I would like to inquire about photography services.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    ) : (
                      <span />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {studio.galleryImages && studio.galleryImages.length > 0 && (
                      <button
                        onClick={() => setSelectedGallery(studio)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FFF6F0] hover:bg-[#FFEADA] text-[#E66A32] text-xs font-bold border border-[#F8CFBE] transition-colors"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#E66A32]" />
                        <span>View Portfolio ({studio.galleryImages.length})</span>
                      </button>
                    )}

                    {studio.instagram && (
                      <a
                        href={studio.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] border border-[#E8E5DF]"
                        aria-label="Instagram Profile"
                      >
                        <Globe className="w-4 h-4 text-[#E66A32]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Portfolio Gallery Modal */}
      {selectedGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#26352D]/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-2xl bg-white border border-[#E8E5DF] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
              <div>
                <h3 className="text-lg font-bold text-[#26352D]">{selectedGallery.name} Portfolio</h3>
                <p className="text-xs text-[#E66A32] font-semibold">{selectedGallery.location}</p>
              </div>
              <button
                onClick={() => setSelectedGallery(null)}
                className="p-1 rounded-lg text-[#647067] hover:text-[#26352D]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedGallery.galleryImages.map((img, idx) => (
                <div key={idx} className="relative h-48 w-full rounded-xl overflow-hidden border border-[#E8E5DF] bg-[#FAF7F2]">
                  <Image src={img} alt={`Portfolio ${idx + 1}`} fill sizes="300px" className="object-cover" />
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8E5DF] flex justify-end">
              <button
                onClick={() => setSelectedGallery(null)}
                className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
