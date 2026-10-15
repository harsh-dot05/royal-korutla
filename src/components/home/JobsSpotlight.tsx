'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeader } from '../common/SectionHeader';
import { LOCAL_JOBS } from '../../data/mockData';
import { MapPin, Building, ArrowRight } from 'lucide-react';

export const JobsSpotlight: React.FC = () => {
  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Local Jobs & Vacancies">
      <SectionHeader
        badge="Local Vacancies"
        title="Korutla Jobs &amp; Shop Hiring"
        subtitle="Immediate openings for sales staff, cashiers, cooks, technicians, and store assistants in local Korutla businesses."
        actionText="View All Local Jobs"
        actionHref="/jobs"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LOCAL_JOBS.slice(0, 2).map((job) => (
          <div
            key={job.id}
            className="rounded-xl p-4 sm:p-5 border border-[#E8E5DF] flex flex-col justify-between bg-white shadow-xs hover:border-[#E66A32] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold text-[#E66A32] uppercase tracking-wider">{job.category}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#FFF6F0] text-[#E66A32] font-bold text-[10px] border border-[#F8CFBE]">
                  {job.type}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[#26352D] hover:text-[#E66A32] transition-colors">
                {job.title}
              </h3>
              <p className="text-xs font-semibold text-[#26352D] flex items-center gap-1.5 mt-1">
                <Building className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>{job.shopName}</span>
              </p>

              <div className="mt-3 flex items-center justify-between text-xs text-[#647067] font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#8A968D]" /> {job.location}</span>
                <span className="text-[#26352D] font-bold">{job.salary}</span>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-[#E8E5DF] flex items-center justify-between">
              <span className="text-[11px] text-[#647067] font-medium">Posted {job.postedDate}</span>
              <Link
                href="/jobs"
                className="text-xs font-bold text-[#E66A32] hover:text-[#D45B25] flex items-center gap-1"
              >
                <span>View Opening</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
