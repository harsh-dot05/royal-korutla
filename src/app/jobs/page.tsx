'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LOCAL_JOBS } from '@/data/mockData';
import { JobListing } from '@/types';
import { Briefcase, MapPin, Phone, MessageSquare, Clock, Search, CheckCircle2, Building, Sparkles, X } from 'lucide-react';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [applyModalJob, setApplyModalJob] = useState<JobListing | null>(null);

  const categories = [
    'All',
    'Sales & Retail',
    'Billing / Cashier',
    'Hotel & Kitchen',
    'Technical Services',
    'Drivers & Delivery',
    'Tuition & School Staff',
    'Beauty & Salon',
  ];

  const filteredJobs = LOCAL_JOBS.filter((job) => {
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-3xl pastel-card p-6 sm:p-8 border border-purple-200/80 bg-gradient-to-r from-purple-50 via-pink-50 to-white shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-xs font-bold mb-3">
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                <span>Korutla Local Hiring Portal</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Local Jobs &amp; Shop Vacancies in <span className="text-purple-600">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Find job openings in local Korutla shops, restaurants, textile showrooms, hospitals &amp; service centers. Contact employers directly via phone or WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 'Sales', 'Billing', 'Cook', 'Driver'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="pastel-card pastel-card-hover rounded-2xl p-5 border border-slate-100 bg-white shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block mb-1">
                      {job.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 hover:text-purple-600">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mt-1">
                      <Building className="w-3.5 h-3.5" />
                      <span>{job.shopName}</span>
                    </p>
                  </div>

                  {job.isVerified && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[10px] font-semibold text-emerald-800 shrink-0">
                      Verified Listing
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 mb-4 text-xs">
                  <div className="flex items-center justify-between text-slate-700 font-bold">
                    <span>Salary Offer:</span>
                    <span className="text-emerald-700 font-extrabold">{job.salary}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {job.postedDate}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.requirements.map((req, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-50 text-[10px] font-medium text-purple-800 border border-purple-100">
                      • {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`tel:${job.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-600" />
                  <span>Call Owner</span>
                </a>

                {job.whatsapp ? (
                  <a
                    href={`https://wa.me/${job.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I saw your job opening for '${job.title}' on Royal Korutla. I want to apply.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-300 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setApplyModalJob(job)}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition-colors shadow-sm"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Quick Apply Modal */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <button onClick={() => setApplyModalJob(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Apply for {applyModalJob.title}</h3>
              <p className="text-xs text-purple-700 font-semibold mt-1">Shop: {applyModalJob.shopName}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Your application has been sent directly to the employer!');
                setApplyModalJob(null);
              }}
              className="space-y-3 text-xs"
            >
              <input type="text" required placeholder="Your Full Name *" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500" />
              <input type="tel" required placeholder="Mobile Number *" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500" />
              <textarea placeholder="Tell them about your past work experience or qualification..." rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500" />
              <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-white text-xs transition-colors shadow-sm">Submit Application</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
