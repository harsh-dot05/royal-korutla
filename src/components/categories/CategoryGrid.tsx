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
    if (activeTab === 'services') return ['services', 'jobs', 'real-estate', 'businesses', 'offers'].includes(cat.slug);
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
    <section id="categories" className="py-12 relative bg-purple-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Discover Korutla"
          title="Browse Local Categories"
          subtitle="Explore all local sectors in Korutla town. Click any category for specialized search, ordering, jobs, and rentals."
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
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
                  : 'bg-white text-slate-700 hover:bg-purple-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Grid (Mobile Responsive: 1 column on mobile, 2 on sm, 3 on md, 4 on lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={getCategoryHref(category.slug)}
              className="pastel-card pastel-card-hover rounded-2xl p-5 flex flex-col justify-between group cursor-pointer border border-slate-200 hover:border-purple-300 relative overflow-hidden bg-white shadow-xs"
            >
              {/* Subtle top accent gradient */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.colorGradient}`}
              />

              <div>
                {/* Header inside Card */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.colorGradient} p-0.5 shadow-sm flex items-center justify-center`}
                  >
                    <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                      <Icon name={category.iconName} className="w-6 h-6 text-purple-700" />
                    </div>
                  </div>

                  {category.badge ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold border border-amber-200">
                      {category.badge}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {category.itemCount} Listings
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-900">
                <span>Open {category.name}</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
