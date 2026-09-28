'use client';

import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { QUICK_FILTERS, LOCAL_STATS } from '../../data/mockData';
import { Icon } from '../common/Icon';

export const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const catEl = document.getElementById('categories');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-6 pb-10 lg:pt-10 lg:pb-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Local Directory Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-4">
            <span>Korutla Local Directory &amp; Services</span>
          </div>

          {/* Main Hero Heading (<10 words) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Find What You Need in <span className="text-blue-700">Korutla</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Discover food, groceries, home services, hospitals, shopping, local jobs, and real estate in Korutla town.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 p-2 rounded-xl bg-white border border-slate-300 shadow-xs max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {/* Category Selector */}
              <div className="w-full sm:w-auto flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <MapPin className="w-4 h-4 text-blue-700 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none cursor-pointer w-full"
                >
                  <option value="all">All Sectors</option>
                  <option value="food">Food &amp; Dining</option>
                  <option value="grocery">Groceries &amp; Marts</option>
                  <option value="shopping">Shopping &amp; Apparel</option>
                  <option value="services">Services &amp; Repair</option>
                  <option value="hospitals">Hospitals &amp; Doctors</option>
                  <option value="education">Education &amp; Tuition</option>
                  <option value="public-places">Public Places</option>
                  <option value="jobs">Local Jobs</option>
                  <option value="real-estate">Real Estate</option>
                </select>
              </div>

              {/* Text Input */}
              <div className="flex-1 w-full relative">
                <input
                  id="hero-search"
                  type="text"
                  placeholder="Search biryani, electrician, doctor, job..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                  suppressHydrationWarning
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Popular:</span>
            {QUICK_FILTERS.map((filter) => (
              <a
                key={filter.id}
                href="#categories"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-colors shadow-2xs"
              >
                <Icon name={filter.iconName} className="w-3.5 h-3.5 text-blue-700" />
                <span>{filter.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Local Key Statistics Banner */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {LOCAL_STATS.map((stat) => (
            <div
              key={stat.id}
              className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3"
            >
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 shrink-0">
                <Icon name={stat.iconName} className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
