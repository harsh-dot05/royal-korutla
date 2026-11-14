'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, Camera, MapPin, Globe, Calendar, Heart } from 'lucide-react';
import { InstagramIcon } from '@/components/common/Icon';
import { CommunityPhoto } from '@/types';

interface PhotoModalProps {
  photo: CommunityPhoto | null;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (photo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [photo, onClose]);

  if (!photo) return null;

  const formattedDate = photo.publishedAt
    ? new Date(photo.publishedAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#26352D]/80 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl sm:rounded-3xl border border-[#E8E5DF] shadow-2xl overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close photo view"
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-[#26352D] border border-[#E8E5DF] shadow-sm transition-all focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Photo Display Frame */}
        <div className="relative w-full md:w-3/5 bg-[#1B2721] min-h-[280px] sm:min-h-[380px] max-h-[50vh] md:max-h-[92vh] flex items-center justify-center overflow-hidden">
          <Image
            src={photo.imageUrl}
            alt={photo.altText || photo.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Photo Story & Metadata Details */}
        <div className="w-full md:w-2/5 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[42vh] md:max-h-[92vh] bg-white space-y-4">
          <div className="space-y-4">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[#E66A32] text-xs font-bold">
              <Camera className="w-3.5 h-3.5" />
              <span>{photo.category}</span>
            </div>

            {/* Title */}
            <div>
              <h2 id="photo-modal-title" className="text-xl sm:text-2xl font-extrabold text-[#26352D] leading-snug">
                {photo.title}
              </h2>
              {photo.location && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#647067] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                  <span>{photo.location}</span>
                </div>
              )}
            </div>

            {/* Photographer Credits Card */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-2">
              <p className="text-[11px] font-bold text-[#647067] uppercase tracking-wider">Captured By</p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-sm font-extrabold text-[#26352D]">{photo.photographerName}</span>
                <div className="flex items-center gap-2">
                  {photo.instagram && (
                    <a
                      href={photo.instagram.startsWith('http') ? photo.instagram : `https://instagram.com/${photo.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#E8E5DF] text-[11px] font-bold text-[#26352D] hover:text-[#E66A32] transition-colors"
                    >
                      <InstagramIcon className="w-3 h-3 text-[#E66A32]" />
                      <span>{photo.instagram.startsWith('@') ? photo.instagram : `@${photo.instagram.replace(/.*instagram\.com\//, '')}`}</span>
                    </a>
                  )}
                  {photo.portfolioUrl && (
                    <a
                      href={photo.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#E8E5DF] text-[11px] font-bold text-[#26352D] hover:text-[#E66A32] transition-colors"
                      title="Photographer Portfolio"
                    >
                      <Globe className="w-3 h-3 text-[#647067]" />
                      <span>Portfolio</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Caption or Story */}
            {photo.caption && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-[#26352D]">Story Behind the Shot</h3>
                <p className="text-xs text-[#647067] leading-relaxed font-normal whitespace-pre-line">
                  {photo.caption}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Attribution & Date Note */}
          <div className="pt-3 border-t border-[#E8E5DF] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#647067]">
              {formattedDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#647067]" />
                  <span>Published {formattedDate}</span>
                </div>
              )}
              <span className="font-medium text-[#26352D]">Royal Korutla Community</span>
            </div>
            <p className="text-[10px] text-[#647067] leading-tight">
              Photographer retains full copyright. Displayed with verified permission on Royal Korutla.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
