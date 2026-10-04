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
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Korutla Visuals"
        title="Stories &amp; Local Reels"
        subtitle="Watch store tours, dish releases, and local updates in Korutla."
      />

      {/* Stories Horizontal Reel Bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-3 scrollbar-none">
        {STORIES_REELS.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveStory(item)}
            className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group"
          >
            {/* Story Thumbnail Avatar Ring */}
            <div className={`relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl p-0.5 overflow-hidden shadow-xs border-2 ${
              item.isNew ? 'border-blue-600' : 'border-slate-300'
            }`}>
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-900">
                <Image
                  src={item.thumbImage}
                  alt={item.title}
                  fill
                  sizes="120px"
                  className="object-cover"
                />

                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[10px] font-bold text-white">
                  <div className="flex items-center gap-1 bg-slate-950/80 px-1.5 py-0.5 rounded-md">
                    <Eye className="w-2.5 h-2.5 text-blue-400" />
                    <span>{item.viewsCount}</span>
                  </div>
                  {item.mediaType === 'video' && <Play className="w-3 h-3 text-white fill-white" />}
                </div>

                {item.isNew && (
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 bg-blue-600 text-[8px] font-bold text-white rounded-md">
                    NEW
                  </span>
                )}
              </div>
            </div>

            <span className="text-[11px] font-semibold text-slate-800 max-w-[90px] truncate text-center group-hover:text-blue-600">
              {item.businessName}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4">
          <div className="relative w-full max-w-sm bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xl">
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white bg-slate-950/90 px-3 py-1 rounded-md border border-slate-700">
                  {activeStory.businessName}
                </span>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="p-2 rounded-full bg-slate-950/90 text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media View */}
            <div className="relative h-[480px] w-full bg-slate-950">
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
                    onClick={() => setActiveStory(null)}
                    className="mt-3 inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <span>View Listing Details</span>
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
