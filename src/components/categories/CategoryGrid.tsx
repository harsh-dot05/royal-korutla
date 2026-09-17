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
    if (activeTab === 'lifestyle') return ['shopping', 'education', 'public-places'].includes(cat.slug);
    if (activeTab === 'services') return ['services', 'jobs', 'real-estate'].includes(cat.slug);
    return true;
  });

  const getCategoryHref = (slug: string) => {
    switch (slug) {
      case 'food':
        return '/food';
      case 'groceries':
      case 'grocery':
        return '/grocery';
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
      default:
        return `/${slug}`;
    }
  };

  return (
    <section id="categories" className="py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Discover Korutla"
          title="Browse Local Categories"
          subtitle="Explore all local sectors in Korutla town. Select any category for specialized directory listings."
        />

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {[
            { id: 'all', label: 'All Sectors' },
            { id: 'essentials', label: 'Food & Health' },
            { id: 'lifestyle', label: 'Shopping & Education' },
            { id: 'services', label: 'Services & Real Estate' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={getCategoryHref(category.slug)}
              className="rounded-xl p-5 flex flex-col justify-between group cursor-pointer border border-slate-200 hover:border-blue-300 relative bg-white shadow-xs transition-colors"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-700 rounded-t-xl" />

              <div>
                {/* Header inside Card */}
                <div className="flex items-center justify-between mb-4 mt-1">
                  <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                    <Icon name={category.iconName} className="w-5 h-5 text-blue-700" />
                  </div>

                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {category.itemCount} Listings
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed font-normal">
                  {category.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                <span>View {category.name}</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
