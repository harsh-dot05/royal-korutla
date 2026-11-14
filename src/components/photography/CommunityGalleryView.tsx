'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, MapPin, Eye, PlusCircle, Sparkles } from 'lucide-react';
import { CommunityPhoto, CommunityPhotoCategory } from '@/types';
import { COMMUNITY_PHOTO_CATEGORIES } from '@/lib/communityPhotographyStore';
import { PhotoModal } from './PhotoModal';

interface CommunityGalleryViewProps {
  photos: CommunityPhoto[];
}

export const CommunityGalleryView: React.FC<CommunityGalleryViewProps> = ({ photos }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<CommunityPhoto | null>(null);

  const filteredPhotos = photos.filter((photo) => {
    if (selectedCategory === 'All') return true;
    return photo.category === selectedCategory;
  });

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-[#E66A32] text-white shadow-xs'
              : 'bg-white text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
          }`}
        >
          All Photos ({photos.length})
        </button>

        {COMMUNITY_PHOTO_CATEGORIES.map((cat) => {
          const count = photos.filter((p) => p.category === cat).length;
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#E66A32] text-white shadow-xs'
                  : 'bg-white text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#647067]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gallery Grid or Welcoming Empty State */}
      {filteredPhotos.length === 0 ? (
        <div className="rounded-3xl border border-[#E8E5DF] bg-white p-8 sm:p-14 text-center space-y-5 shadow-xs">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#FFF6F0] border border-[#F8CFBE] flex items-center justify-center text-[#E66A32]">
            <Camera className="w-8 h-8 stroke-[1.8]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-extrabold text-[#26352D]">
              {selectedCategory === 'All'
                ? 'Be the First to Feature in Our Gallery'
                : `No Photographs in "${selectedCategory}" Yet`}
            </h3>
            <p className="text-xs sm:text-sm text-[#647067] leading-relaxed">
              We do not publish fabricated or unverified photos. Every photograph is a genuine community submission with verified photographer attribution and permission.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#submit-photo"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Your Korutla Photograph</span>
            </a>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] font-semibold text-xs border border-[#E8E5DF] transition-colors"
              >
                Show All Categories
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <article
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group cursor-pointer rounded-2xl bg-white border border-[#E8E5DF] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo Frame with subtle hover zoom */}
              <div className="relative aspect-4/3 w-full bg-[#FAF7F2] overflow-hidden">
                <Image
                  src={photo.imageUrl}
                  alt={photo.altText || photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Subtle overlay button */}
                <div className="absolute inset-0 bg-[#26352D]/0 group-hover:bg-[#26352D]/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#26352D] text-xs font-bold shadow-md">
                    <Eye className="w-3.5 h-3.5 text-[#E66A32]" />
                    <span>View Story</span>
                  </span>
                </div>

                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#26352D] text-[10px] font-bold shadow-xs border border-[#E8E5DF]">
                    {photo.category}
                  </span>
                </div>
              </div>

              {/* Photo Info Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-extrabold text-sm text-[#26352D] group-hover:text-[#E66A32] transition-colors line-clamp-1">
                  {photo.title}
                </h3>

                {photo.caption && (
                  <p className="text-xs text-[#647067] line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                )}

                <div className="pt-2 border-t border-[#E8E5DF] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#26352D] font-bold">
                    <Camera className="w-3 h-3 text-[#E66A32]" />
                    <span className="truncate max-w-[130px]">{photo.photographerName}</span>
                  </div>

                  {photo.location && (
                    <div className="flex items-center gap-1 text-[#647067] text-[11px] font-medium">
                      <MapPin className="w-3 h-3 text-[#E66A32] shrink-0" />
                      <span className="truncate max-w-[110px]">{photo.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Lightbox / Modal */}
      <PhotoModal photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </div>
  );
};
