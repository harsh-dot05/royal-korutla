'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LOCAL_JOBS } from '@/data/mockData';
import { JobListing } from '@/types';
import { Briefcase, MapPin, Phone, MessageSquare, Clock, Search, Building, X } from 'lucide-react';

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
        <div className="rounded-xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
                <Briefcase className="w-3.5 h-3.5 text-blue-700" />
                <span>Korutla Local Jobs</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Local Jobs &amp; Vacancies in <span className="text-blue-700">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Find local job vacancies in Korutla shops, showrooms, restaurants, and service centers.
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
              placeholder="Search sales, billing, cook, driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List Grid */}
        {filteredJobs.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">No job openings found matching your criteria.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl p-5 border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                        {job.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 hover:text-blue-700 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-1">
                        <Building className="w-3.5 h-3.5 text-blue-700" />
                        <span>{job.shopName}</span>
                      </p>
                    </div>

                    {job.isVerified && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-800 shrink-0">
                        Verified Listing
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 mb-4 text-xs">
                    <div className="flex items-center justify-between text-slate-700 font-bold">
                      <span>Salary Offer:</span>
                      <span className="text-blue-700 font-bold">{job.salary}</span>
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
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-semibold text-blue-800 border border-blue-100">
                        • {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${job.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors border border-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-700" />
                    <span>Call Owner</span>
                  </a>

                  {job.whatsapp ? (
                    <a
                      href={`https://wa.me/${job.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I saw your job opening for '${job.title}' on Royal Korutla. I want to apply.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-bold text-white transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setApplyModalJob(job)}
                      className="flex-1 px-3 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-bold text-white transition-colors"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Quick Apply Modal */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <button onClick={() => setApplyModalJob(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Apply for {applyModalJob.title}</h3>
              <p className="text-xs text-blue-700 font-semibold mt-1">Shop: {applyModalJob.shopName}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Your application has been sent directly to the employer!');
                setApplyModalJob(null);
              }}
              className="space-y-3 text-xs"
            >
              <input type="text" required placeholder="Your Full Name *" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-700" />
              <input type="tel" required placeholder="Mobile Number *" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-700" />
              <textarea placeholder="Qualification or past experience..." rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-700" />
              <button type="submit" className="w-full py-3 rounded-lg bg-blue-700 hover:bg-blue-800 font-bold text-white text-xs transition-colors">Submit Application</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
