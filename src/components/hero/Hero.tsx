'use client';

import React, { useState } from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';
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
    <section className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden bg-gradient-to-b from-purple-50/80 via-slate-50 to-slate-50">
      {/* Soft Glow Backdrops */}
      <div className="hero-glow-light -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-300/30" />
      <div className="hero-glow-light top-32 right-10 w-[350px] h-[250px] bg-amber-300/30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Royal Local Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs sm:text-sm font-bold mb-5 shadow-xs">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Korutla&apos;s #1 Local Discovery &amp; Directory Platform</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Everything in <span className="gradient-text-royal">Korutla</span>, Right at Your <span className="gradient-text-gold">Fingertips</span>
          </h1>

          <p className="mt-3.5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Discover local food, hospitals, shopping, services, real estate, job vacancies &amp; exclusive store offers across Korutla town.
          </p>

          {/* Search Bar Container */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-7 p-2 rounded-2xl bg-white border border-purple-200 shadow-xl shadow-purple-950/5 max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {/* Category Dropdown Selector */}
              <div className="w-full sm:w-auto flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none cursor-pointer w-full"
                >
                  <option value="all">All Korutla</option>
                  <option value="food">Food &amp; Dining</option>
                  <option value="hospitals">Hospitals 24/7</option>
                  <option value="services">Services &amp; Repair</option>
                  <option value="shopping">Shopping</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="jobs">Local Jobs</option>
                </select>
              </div>

              {/* Text Input */}
              <div className="flex-1 w-full relative">
                <input
                  id="hero-search"
                  type="text"
                  placeholder="Search 'Biryani', 'Doctor', 'Plumber', 'Saree'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-4 py-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>

              {/* Search Action Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/20 active:scale-95 shrink-0"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick Search Tag Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Popular:</span>
            {QUICK_FILTERS.map((filter) => (
              <a
                key={filter.id}
                href="#categories"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-purple-100 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-900 text-xs font-semibold transition-all shadow-2xs"
              >
                <Icon name={filter.iconName} className="w-3.5 h-3.5 text-amber-600" />
                <span>{filter.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Local Key Statistics Banner */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {LOCAL_STATS.map((stat) => (
            <div
              key={stat.id}
              className="pastel-card pastel-card-hover p-4 sm:p-5 rounded-2xl flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 shrink-0">
                <Icon name={stat.iconName} className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">
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
