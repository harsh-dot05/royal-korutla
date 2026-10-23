'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LOCAL_JOBS } from '@/data/mockData';
import { JobListing } from '@/types';
import { Briefcase, MapPin, Phone, MessageCircle, Clock, Search, Building, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>(LOCAL_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [applyModalJob, setApplyModalJob] = useState<JobListing | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setJobs(data.data);
        }
      } catch (err) {
        // Fallback to LOCAL_JOBS
      }
    }
    loadJobs();
  }, []);

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

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[#E8E5DF] bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold mb-3">
                <Briefcase className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Korutla Local Jobs</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Local Jobs &amp; Vacancies in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] mt-2 max-w-xl leading-relaxed">
                Find local job vacancies in Korutla shops, textile showrooms, supermarkets, restaurants, and repair centers.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#647067]" />
            <input
              type="text"
              placeholder="Search sales, billing, cook, driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#26352D] placeholder-[#647067] focus:outline-none shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#E66A32] text-white shadow-xs'
                    : 'bg-white text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List Grid */}
        {filteredJobs.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-[#E8E5DF] p-8 space-y-4">
            <p className="text-sm font-semibold text-[#26352D]">No job openings found matching your criteria.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => {
              return (
                <div
                  key={job.id}
                  className="rounded-2xl p-6 border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Badges Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FFF6F0] text-[#E66A32] border border-[#F8CFBE]">
                          {job.category}
                        </span>
                        {job.badgeLabel && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide bg-[#26352D] text-white shadow-2xs">
                            {job.badgeLabel}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {job.isFeatured && (
                          <span className="px-2 py-0.5 rounded-md bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-[10px] font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#E66A32]" />
                            <span>Featured</span>
                          </span>
                        )}
                        {job.isVerified && (
                          <span className="px-2 py-0.5 rounded-md bg-[#F0F4F1] border border-[#26352D]/15 text-[#26352D] text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-[#26352D]" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#26352D]">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#647067] flex items-center gap-1.5 mt-1">
                      <Building className="w-3.5 h-3.5 text-[#E66A32]" />
                      <span>{job.shopName}</span>
                    </p>

                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1.5 my-3.5 text-xs">
                      <div className="flex items-center justify-between text-[#26352D] font-bold">
                        <span>Salary Offer:</span>
                        <span className="font-extrabold text-sm text-[#E66A32]">{job.salary}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#647067] text-[11px]">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#647067]" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#647067]" /> {job.postedDate}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#647067] line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.requirements.map((req, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-[#FAF7F2] text-[#26352D] border border-[#E8E5DF]">
                          • {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-[#E8E5DF] flex items-center justify-between gap-3 text-xs font-bold">
                    <a
                      href={`tel:${job.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] transition-colors border border-[#E8E5DF]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                      <span>Call Owner</span>
                    </a>

                    {job.whatsapp ? (
                      <a
                        href={`https://wa.me/${job.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I saw your job opening for '${job.title}' on Royal Korutla. I want to apply.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-all shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => setApplyModalJob(job)}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white transition-all shadow-xs"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Quick Apply Modal */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#26352D]/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md bg-white border border-[#E8E5DF] rounded-2xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setApplyModalJob(null)}
              className="absolute top-4 right-4 text-[#647067] hover:text-[#26352D]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-lg font-bold text-[#26352D]">Apply for {applyModalJob.title}</h3>
              <p className="text-xs text-[#E66A32] font-semibold mt-1">Shop: {applyModalJob.shopName}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Your application has been sent directly to the employer!');
                setApplyModalJob(null);
              }}
              className="space-y-3 text-xs"
            >
              <input type="text" required placeholder="Your Full Name *" className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none" />
              <input type="tel" required placeholder="Mobile Number *" className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none" />
              <textarea placeholder="Qualification or past experience..." rows={3} className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none" />
              <button type="submit" className="w-full py-3 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] font-bold text-white text-xs transition-colors shadow-xs">Submit Application</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
