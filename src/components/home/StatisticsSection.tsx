'use client';

import React from 'react';
import { LOCAL_STATS } from '../../data/mockData';
import { Icon } from '../common/Icon';

export const StatisticsSection: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4" aria-label="Korutla Statistics">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {LOCAL_STATS.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-4 rounded-xl border border-[#E8E5DF] flex items-start gap-3 shadow-xs hover:border-[#E66A32] transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-[#FFF6F0] text-[#E66A32] shrink-0 border border-[#F8CFBE]">
              <Icon name={stat.iconName} className="w-5 h-5 text-[#E66A32]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#26352D] tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-[#26352D] mt-0.5">
                {stat.label}
              </div>
              <div className="text-[11px] text-[#647067] hidden sm:block mt-0.5">
                {stat.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
