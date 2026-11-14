'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, MapPin, ArrowRight, PlusCircle, Sparkles } from 'lucide-react';
import { CommunityPhoto } from '@/types';
import { PhotoModal } from '@/components/photography/PhotoModal';

export const CommunityPhotographySection: React.FC = () => {
  const [photos, setPhotos] = useState<CommunityPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<CommunityPhoto | null>(null);

  useEffect(() => {
    async function loadCommunityPhotos() {
      try {
        const res = await fetch('/api/photography/community?featured=true&limit=4');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setPhotos(data.data);
        }
      } catch (err) {
        console.error('Failed to load homepage community photography:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCommunityPhotos();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="rounded-3xl bg-white border border-[#E8E5DF] p-6 sm:p-10 shadow-xs space-y-6">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E8E5DF]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[#E66A32] text-xs font-bold">
              <Camera className="w-3.5 h-3.5" />
              <span>Town Photography Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#26352D] tracking-tight">
              Korutla Through Your Lens
            </h2>
            <p className="text-xs sm:text-sm text-[#647067] max-w-xl font-normal leading-relaxed">
              Discover the moments, places, and people that make Korutla special.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/photography#submit-photo"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#FFF6F0] text-[#26352D] hover:text-[#E66A32] border border-[#E8E5DF] hover:border-[#F8CFBE] text-xs font-bold transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#E66A32]" />
              <span>Submit Your Photo</span>
            </Link>
            <Link
              href="/photography"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Content: Photos or Invitation Empty State */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-4/3 bg-[#FAF7F2] animate-pulse rounded-2xl border border-[#E8E5DF]" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          /* Concise Invitation / Empty State (No fabricated photos) */
          <div className="p-8 sm:p-10 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-white border border-[#E8E5DF] flex items-center justify-center text-[#E66A32]">
              <Camera className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base font-extrabold text-[#26352D]">
                Have a perspective of Korutla to share?
              </h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                We celebrate genuine work by local residents and photographers. Submit your shots of Korutla streets, celebrations, landscapes, and daily life for community feature.
              </p>
            </div>
            <div className="pt-1">
              <Link
                href="/photography#submit-photo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <span>Submit Your First Photograph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Approved Community Photographs Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <article
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group cursor-pointer rounded-2xl bg-white border border-[#E8E5DF] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 w-full bg-[#FAF7F2] overflow-hidden">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.altText || photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-white/90 text-[#26352D] text-[9px] font-bold border border-[#E8E5DF]">
                      {photo.category}
                    </span>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <h3 className="font-bold text-xs text-[#26352D] group-hover:text-[#E66A32] transition-colors truncate">
                    {photo.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-[#647067]">
                    <span className="font-semibold text-[#26352D] truncate max-w-[110px]">
                      {photo.photographerName}
                    </span>
                    {photo.location && (
                      <span className="flex items-center gap-0.5 text-[10px] truncate max-w-[90px]">
                        <MapPin className="w-2.5 h-2.5 text-[#E66A32] shrink-0" />
                        <span>{photo.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <PhotoModal photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </section>
  );
};
