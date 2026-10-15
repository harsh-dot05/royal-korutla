'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Eye, X } from 'lucide-react';
import { STORIES_REELS } from '../../data/mockData';
import { SectionHeader } from '../common/SectionHeader';
import { StoryReel } from '../../types';

export const StoriesReelsSection: React.FC = () => {
  const [activeStory, setActiveStory] = useState<StoryReel | null>(null);

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Visual Updates">
      <SectionHeader
        badge="Korutla Visuals"
        title="Stories &amp; Local Reels"
        subtitle="Watch store tours, dish releases, and local updates in Korutla."
      />

      {/* Stories Horizontal Reel Bar */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-3 scrollbar-none">
        {STORIES_REELS.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveStory(item)}
            className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group"
          >
            {/* Story Thumbnail Avatar Ring */}
            <div
              className={`relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl p-0.5 overflow-hidden shadow-xs border-2 ${
                item.isNew ? 'border-[#E66A32]' : 'border-[#E8E5DF]'
              }`}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#26352D]">
                <Image
                  src={item.thumbImage}
                  alt={item.title}
                  fill
                  sizes="120px"
                  className="object-cover"
                />

                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[10px] font-bold text-white">
                  <div className="flex items-center gap-1 bg-[#1C2721]/85 px-1.5 py-0.5 rounded-md">
                    <Eye className="w-2.5 h-2.5 text-[#E66A32]" />
                    <span>{item.viewsCount}</span>
                  </div>
                  {item.mediaType === 'video' && <Play className="w-3 h-3 text-white fill-white" />}
                </div>

                {item.isNew && (
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#E66A32] text-[8px] font-bold text-white rounded-md">
                    NEW
                  </span>
                )}
              </div>
            </div>

            <span className="text-[11px] font-semibold text-[#26352D] max-w-[90px] truncate text-center group-hover:text-[#E66A32] transition-colors">
              {item.businessName}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16201A]/90 p-4">
          <div className="relative w-full max-w-sm bg-white rounded-xl overflow-hidden border border-[#E8E5DF] shadow-2xl">
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white bg-[#16201A]/90 px-3 py-1 rounded-md border border-[#26352D]">
                  {activeStory.businessName}
                </span>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="p-1.5 rounded-full bg-[#16201A]/90 text-white hover:bg-[#26352D]"
                aria-label="Close story"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media View */}
            <div className="relative h-[480px] w-full bg-[#16201A]">
              <Image
                src={activeStory.thumbImage}
                alt={activeStory.title}
                fill
                className="object-cover"
              />

              <div className="absolute bottom-6 left-6 right-6 z-20">
                <h3 className="text-base font-bold text-white leading-snug">
                  {activeStory.title}
                </h3>
                {activeStory.linkUrl && (
                  <Link
                    href={activeStory.linkUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 mt-3 rounded-lg bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <span>Visit Business</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
