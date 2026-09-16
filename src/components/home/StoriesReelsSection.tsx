'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Eye, Sparkles, X } from 'lucide-react';
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
        subtitle="Watch quick behind-the-scenes videos, new dish releases, store tours, and local Korutla updates."
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
            <div className={`relative w-20 h-28 sm:w-24 sm:h-32 rounded-2xl p-0.5 overflow-hidden transition-transform group-hover:scale-105 shadow-md ${
              item.isNew ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600' : 'bg-slate-300'
            }`}>
              <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-slate-900">
                <Image
                  src={item.thumbImage}
                  alt={item.title}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors" />

                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[10px] font-bold text-white">
                  <div className="flex items-center gap-1 bg-slate-950/70 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                    <Eye className="w-2.5 h-2.5 text-amber-400" />
                    <span>{item.viewsCount}</span>
                  </div>
                  {item.mediaType === 'video' && <Play className="w-3 h-3 text-white fill-white" />}
                </div>

                {item.isNew && (
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 bg-amber-500 text-[8px] font-black text-slate-950 rounded-full">
                    NEW
                  </span>
                )}
              </div>
            </div>

            <span className="text-[11px] font-semibold text-slate-800 max-w-[90px] truncate text-center group-hover:text-purple-700">
              {item.businessName}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-sm bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700">
                  {activeStory.businessName}
                </span>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800"
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 z-20">
                <h3 className="text-base font-bold text-white leading-snug">
                  {activeStory.title}
                </h3>
                {activeStory.linkUrl && (
                  <Link
                    href={activeStory.linkUrl}
                    onClick={() => setActiveStory(null)}
                    className="mt-3 inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
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
