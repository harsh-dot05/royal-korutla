'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '../../data/mockData';
import { SectionHeader } from '../common/SectionHeader';
import { Icon } from '../common/Icon';

export const CategoryGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredCategories = CATEGORIES.filter((cat) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'essentials') return ['food', 'groceries', 'hospitals'].includes(cat.slug);
    if (activeTab === 'lifestyle') return ['clothing', 'shopping', 'education', 'public-places', 'photography'].includes(cat.slug);
    if (activeTab === 'services') return ['services', 'jobs', 'real-estate'].includes(cat.slug);
    return true;
  });

  const getCategoryHref = (slug: string) => {
    switch (slug) {
      case 'food':
        return '/food';
      case 'groceries':
      case 'grocery':
        return '/groceries';
      case 'clothing':
        return '/clothing';
      case 'shopping':
        return '/shopping';
      case 'services':
        return '/services';
      case 'hospitals':
        return '/hospitals';
      case 'education':
        return '/education';
      case 'public-places':
        return '/public-places';
      case 'jobs':
        return '/jobs';
      case 'real-estate':
        return '/real-estate';
      case 'photography':
        return '/photography';
      case 'offers':
        return '/offers';
      default:
        return `/${slug}`;
    }
  };

  return (
    <section id="categories" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Browse Categories">
      <SectionHeader
        badge="Discover Korutla"
        title="Shop by Category"
        subtitle="Explore all local sectors in Korutla town. Select any category for verified listings and direct contact."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-5 scrollbar-none">
        {[
          { id: 'all', label: 'All Sectors' },
          { id: 'essentials', label: 'Food & Health' },
          { id: 'lifestyle', label: 'Shopping & Education' },
          { id: 'services', label: 'Services & Real Estate' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#E66A32] text-white shadow-xs'
                : 'bg-white text-[#26352D] hover:bg-[#FAF7F2] border border-[#E8E5DF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <Link
            key={category.id}
            href={getCategoryHref(category.slug)}
            className="rounded-xl p-4 sm:p-5 flex flex-col justify-between group cursor-pointer border border-[#E8E5DF] hover:border-[#E66A32] relative bg-white shadow-xs transition-colors"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#E66A32] rounded-t-xl" />

            <div>
              {/* Header inside Card */}
              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="w-10 h-10 rounded-lg bg-[#FFF6F0] text-[#E66A32] flex items-center justify-center border border-[#F8CFBE]">
                  <Icon name={category.iconName} className="w-5 h-5 text-[#E66A32]" />
                </div>

                <span className="text-[11px] font-semibold text-[#647067] bg-[#FAF7F2] border border-[#E8E5DF] px-2 py-0.5 rounded-md">
                  {category.itemCount} Listings
                </span>
              </div>

              {/* Content */}
              <h3 className="text-sm sm:text-base font-bold text-[#26352D] group-hover:text-[#E66A32] transition-colors">
                {category.name}
              </h3>
              <p className="text-[#647067] text-xs mt-1 line-clamp-2 leading-relaxed font-normal">
                {category.description}
              </p>
            </div>

            {/* Action Link */}
            <div className="mt-4 pt-3 border-t border-[#E8E5DF] flex items-center justify-between text-xs font-bold text-[#E66A32]">
              <span>View {category.name}</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
