'use client';

import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { QUICK_FILTERS } from '../../data/mockData';
import { Icon } from '../common/Icon';

export const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory !== 'all') {
      window.location.href = `/${selectedCategory}`;
      return;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (q.includes('cloth') || q.includes('saree') || q.includes('textile') || q.includes('suit')) {
        window.location.href = '/clothing';
        return;
      }
      if (q.includes('food') || q.includes('biryani') || q.includes('hotel') || q.includes('restaurant')) {
        window.location.href = '/food';
        return;
      }
      if (q.includes('grocery') || q.includes('vegetable') || q.includes('supermarket')) {
        window.location.href = '/groceries';
        return;
      }
      if (q.includes('doctor') || q.includes('hospital') || q.includes('clinic') || q.includes('emergency')) {
        window.location.href = '/hospitals';
        return;
      }
      if (q.includes('job') || q.includes('vacancy') || q.includes('work') || q.includes('hiring')) {
        window.location.href = '/jobs';
        return;
      }
      if (q.includes('house') || q.includes('rent') || q.includes('plot') || q.includes('real estate')) {
        window.location.href = '/real-estate';
        return;
      }
      if (q.includes('service') || q.includes('electric') || q.includes('plumb') || q.includes('repair')) {
        window.location.href = '/services';
        return;
      }
      const catEl = document.getElementById('categories');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-6 pb-6 lg:pt-8 lg:pb-8 bg-transparent" aria-label="Search and Discovery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Local Directory Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs sm:text-sm font-bold mb-3">
            <span>Everything in Korutla</span>
          </div>

          {/* Main Hero Heading (<10 words) */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#26352D] tracking-tight leading-tight">
            Find What You Need in <span className="text-[#E66A32]">Korutla</span>
          </h1>

          <p className="mt-2.5 text-xs sm:text-sm text-[#647067] font-normal leading-relaxed max-w-xl mx-auto">
            Discover food delivery, daily groceries, clothing stores, doctors, repair services, and local jobs in Korutla town and nearby villages.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-5 p-1.5 sm:p-2 rounded-xl bg-white border border-[#D5D1C8] focus-within:border-[#E66A32] shadow-xs max-w-2xl mx-auto transition-colors"
          >
            <div className="flex flex-col sm:flex-row items-center gap-1.5">
              {/* Category Selector */}
              <div className="w-full sm:w-auto flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-[#E8E5DF] shrink-0">
                <MapPin className="w-4 h-4 text-[#E66A32] shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-[#26352D] font-semibold focus:outline-none cursor-pointer w-full"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  <option value="food">Food &amp; Dining</option>
                  <option value="groceries">Groceries &amp; Marts</option>
                  <option value="clothing">Clothing Stores</option>
                  <option value="shopping">Shopping &amp; Apparel</option>
                  <option value="services">Local Services</option>
                  <option value="emergency">Emergency 24/7</option>
                  <option value="hospitals">Hospitals &amp; Doctors</option>
                  <option value="jobs">Local Jobs</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="photography">Photography</option>
                </select>
              </div>

              {/* Text Input */}
              <div className="flex-1 w-full relative">
                <input
                  id="hero-search"
                  type="text"
                  placeholder="Search biryani, sarees, electrician, hospital, jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-[#26352D] placeholder-[#8A968D] focus:outline-none font-medium"
                  suppressHydrationWarning
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Popular Search Shortcuts */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-xs font-semibold text-[#647067] mr-1">Popular:</span>
            {QUICK_FILTERS.map((filter) => (
              <a
                key={filter.id}
                href="#categories"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-[#E8E5DF] hover:border-[#E66A32] text-[#26352D] hover:text-[#E66A32] text-xs font-medium transition-colors shadow-2xs"
              >
                <Icon name={filter.iconName} className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>{filter.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
