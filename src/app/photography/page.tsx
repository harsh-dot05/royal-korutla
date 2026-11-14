'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CommunityPhoto, PhotographyBusiness, PhotographyType } from '@/types';
import { PHOTOGRAPHY_BUSINESSES } from '@/data/mockData';
import { CommunityGalleryView } from '@/components/photography/CommunityGalleryView';
import { SubmitPhotoSection } from '@/components/photography/SubmitPhotoSection';
import {
  Camera,
  MapPin,
  Phone,
  MessageCircle,
  Search,
  CheckCircle2,
  Globe,
  PlusCircle,
  Sparkles,
  Building2,
  Image as ImageIcon,
} from 'lucide-react';

export default function PhotographyPage() {
  const [activeTab, setActiveTab] = useState<'community' | 'studios'>('community');
  const [communityPhotos, setCommunityPhotos] = useState<CommunityPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState<boolean>(true);

  // Studios state for commercial section
  const [studioSearch, setStudioSearch] = useState('');
  const [selectedStudioType, setSelectedStudioType] = useState<string>('All');
  const [selectedStudioModal, setSelectedStudioModal] = useState<PhotographyBusiness | null>(null);

  useEffect(() => {
    async function fetchCommunityPhotos() {
      try {
        const res = await fetch('/api/photography/community');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCommunityPhotos(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch community photos:', err);
      } finally {
        setLoadingPhotos(false);
      }
    }
    fetchCommunityPhotos();
  }, []);

  const studioTypes: (string | PhotographyType)[] = [
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
    const matchesType =
      selectedStudioType === 'All' || studio.photographyTypes.includes(selectedStudioType as PhotographyType);
    const matchesSearch =
      studio.name.toLowerCase().includes(studioSearch.toLowerCase()) ||
      studio.location.toLowerCase().includes(studioSearch.toLowerCase()) ||
      studio.description.toLowerCase().includes(studioSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Main Hero Header */}
        <div className="rounded-3xl p-6 sm:p-10 border border-[#E8E5DF] bg-white shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[#E66A32] text-xs font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span>Korutla Photography Community</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#26352D] tracking-tight">
                Korutla Through Your Lens
              </h1>

              <p className="text-sm sm:text-base text-[#647067] font-normal leading-relaxed">
                Our town, your perspective. Discover Korutla through the eyes of local photographers.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
              <a
                href="#submit-photo"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Your Photo</span>
              </a>
            </div>
          </div>

          {/* Tab Switcher between Community Showcase and Commercial Studios */}
          <div className="mt-8 pt-6 border-t border-[#E8E5DF] flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('community')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'community'
                  ? 'bg-[#26352D] text-white shadow-xs'
                  : 'bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#647067]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Community Gallery ({communityPhotos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('studios')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'studios'
                  ? 'bg-[#26352D] text-white shadow-xs'
                  : 'bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#647067]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Commercial Studios &amp; Wedding Teams ({PHOTOGRAPHY_BUSINESSES.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: COMMUNITY GALLERY (Primary Feature) */}
        {activeTab === 'community' && (
          <div className="space-y-12">
            {/* Gallery View */}
            {loadingPhotos ? (
              <div className="py-16 text-center text-[#647067] text-xs space-y-2">
                <div className="w-8 h-8 mx-auto border-2 border-[#E66A32] border-t-transparent rounded-full animate-spin" />
                <p>Loading community photographs...</p>
              </div>
            ) : (
              <CommunityGalleryView photos={communityPhotos} />
            )}

            {/* Submission Section */}
            <SubmitPhotoSection />
          </div>
        )}

        {/* TAB 2: COMMERCIAL STUDIOS & SERVICES (Preserved Functionality) */}
        {activeTab === 'studios' && (
          <div className="space-y-8">
            {/* Search & Studio Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#647067]" />
                <input
                  type="text"
                  placeholder="Search studio name, location..."
                  value={studioSearch}
                  onChange={(e) => setStudioSearch(e.target.value)}
                  className="w-full bg-white border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#26352D] placeholder-[#647067] focus:outline-none shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
                {studioTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedStudioType(type)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      selectedStudioType === type
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
                  onClick={() => {
                    setSelectedStudioType('All');
                    setStudioSearch('');
                  }}
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
                    className="rounded-2xl border border-[#E8E5DF] bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Studio Cover Image */}
                      <div className="relative h-44 w-full bg-[#FAF7F2]">
                        <Image
                          src={studio.coverImage}
                          alt={studio.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                        {studio.isVerified && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-[#26352D] text-[10px] font-bold shadow-xs border border-[#E8E5DF]">
                            <CheckCircle2 className="w-3 h-3 text-[#25D366]" />
                            <span>Verified Studio</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-[#26352D]">{studio.name}</h3>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#647067]">
                          <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                          <span>{studio.location}</span>
                        </div>

                        <p className="text-xs text-[#647067] line-clamp-2 leading-relaxed">{studio.description}</p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {studio.photographyTypes.map((type) => (
                            <span
                              key={type}
                              className="px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#26352D] text-[10px] font-semibold border border-[#E8E5DF]"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Contact Actions */}
                    <div className="p-5 pt-0 border-t border-[#E8E5DF] mt-4 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${studio.phone}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] font-bold text-xs transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${(studio.whatsapp || studio.phone).replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
