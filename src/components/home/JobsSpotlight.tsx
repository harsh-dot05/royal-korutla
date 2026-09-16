'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeader } from '../common/SectionHeader';
import { LOCAL_JOBS } from '../../data/mockData';
import { Briefcase, MapPin, Building, ArrowRight } from 'lucide-react';

export const JobsSpotlight: React.FC = () => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Local Vacancies"
        title="Korutla Jobs &amp; Shop Hiring"
        subtitle="Immediate openings for sales staff, cashiers, cooks, technicians, and store assistants in local Korutla businesses."
        actionText="View All Local Jobs"
        actionHref="/jobs"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {LOCAL_JOBS.slice(0, 2).map((job) => (
          <div
            key={job.id}
            className="pastel-card pastel-card-hover rounded-2xl p-5 border border-slate-200 flex flex-col justify-between bg-white shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">{job.category}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                  {job.type}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 hover:text-purple-700 transition-colors">
                {job.title}
              </h3>
              <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mt-1">
                <Building className="w-3.5 h-3.5" />
                <span>{job.shopName}</span>
              </p>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</span>
                <span className="text-emerald-700 font-bold">{job.salary}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Posted {job.postedDate}</span>
              <Link
                href="/jobs"
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
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
