'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  ShieldCheck,
  Landmark,
  Building2,
  ArrowRight,
  User,
  CheckCircle2,
  Phone,
  MapPin,
} from 'lucide-react';
import { PublicRepresentative } from '@/types';

export const RepresentativesSpotlight: React.FC = () => {
  const [mla, setMla] = useState<PublicRepresentative | null>(null);
  const [chairman, setChairman] = useState<PublicRepresentative | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/representatives');
        const json = await res.json();
        if (json.success && json.data) {
          setMla(json.data.mla || null);
          setChairman(json.data.chairman || null);
        }
      } catch (err) {
        console.error('Failed to load representatives spotlight:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6"
      aria-label="Public Representatives Preview"
    >
      <div className="bg-white rounded-2xl border border-[#E8E5DF] p-5 sm:p-7 shadow-xs">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E8E5DF] gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold mb-1">
              <Landmark className="w-3.5 h-3.5" />
              <span>Civic Directory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#26352D] tracking-tight">
              Public Representatives of Korutla
            </h2>
            <p className="text-xs sm:text-sm text-[#647067] mt-0.5">
              Korutla MLA, Municipal Chairperson, and 33 Municipal Ward Councillors
            </p>
          </div>

          <Link
            href="/representatives"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#26352D] hover:bg-[#1E2B24] text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
          >
            <span>View All 33 Wards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Columns Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          {/* 1. MLA Card (First) */}
          <div className="bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl p-4 flex flex-col justify-between hover:border-[#D5D1C8] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black tracking-wider text-[#E66A32] uppercase">
                  01. MLA
                </span>
                {mla?.isVerified && mla.name ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-[#647067] bg-white px-2 py-0.5 rounded border border-[#E8E5DF]">
                    Profile Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg bg-white border border-[#E8E5DF] overflow-hidden flex items-center justify-center shrink-0">
                  {mla?.photoUrl ? (
                    <Image src={mla.photoUrl} alt={mla.name || 'MLA'} fill className="object-cover" sizes="48px" />
                  ) : (
                    <User className="w-6 h-6 text-[#647067]" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-[#26352D] truncate">
                    {mla?.isVerified && mla?.name ? mla.name : 'Korutla MLA'}
                  </h3>
                  <p className="text-[11px] text-[#647067] truncate">
                    Member of Legislative Assembly
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#647067] mt-3 line-clamp-2">
                {mla?.isVerified && mla?.name
                  ? `${mla.constituency || 'Korutla Constituency'}`
                  : 'Official constituency representative details awaiting gazette verification.'}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-[#E8E5DF]/70">
              <Link
                href="/representatives"
                className="text-xs font-semibold text-[#26352D] hover:text-[#E66A32] flex items-center gap-1"
              >
                <span>View MLA Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 2. Municipal Chairperson Card (Second) */}
          <div className="bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl p-4 flex flex-col justify-between hover:border-[#D5D1C8] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black tracking-wider text-[#26352D] uppercase">
                  02. Municipal Chairman
                </span>
                {chairman?.isVerified && chairman.name ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-[#647067] bg-white px-2 py-0.5 rounded border border-[#E8E5DF]">
                    Profile Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg bg-white border border-[#E8E5DF] overflow-hidden flex items-center justify-center shrink-0">
                  {chairman?.photoUrl ? (
                    <Image src={chairman.photoUrl} alt={chairman.name || 'Chairman'} fill className="object-cover" sizes="48px" />
                  ) : (
                    <Building2 className="w-6 h-6 text-[#647067]" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-[#26352D] truncate">
                    {chairman?.isVerified && chairman?.name ? chairman.name : 'Municipal Chairperson'}
                  </h3>
                  <p className="text-[11px] text-[#647067] truncate">
                    Korutla Municipality
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#647067] mt-3 line-clamp-2">
                {chairman?.isVerified && chairman?.name
                  ? `${chairman.areaName || 'Korutla Municipal Council'}`
                  : 'Municipal civic head overseeing local sanitation and town development.'}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-[#E8E5DF]/70">
              <Link
                href="/representatives"
                className="text-xs font-semibold text-[#26352D] hover:text-[#E66A32] flex items-center gap-1"
              >
                <span>View Chairperson Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 3. All 33 Ward Councillors Teaser Card */}
          <div className="bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl p-4 flex flex-col justify-between hover:border-[#D5D1C8] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black tracking-wider text-[#26352D] uppercase">
                  03. Ward Directory
                </span>
                <span className="text-[10px] font-bold text-[#E66A32] bg-[#FFF6F0] px-2 py-0.5 rounded border border-[#F8CFBE]">
                  33 Wards
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#26352D] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
                  1-33
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#26352D]">
                    Municipal Councillors
                  </h3>
                  <p className="text-[11px] text-[#647067]">
                    Searchable Ward Directory
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#647067] mt-3">
                Find your local ward councillor across Wards 1 to 33, check jurisdiction, and reach out for municipal services.
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-[#E8E5DF]/70">
              <Link
                href="/representatives"
                className="text-xs font-bold text-[#E66A32] hover:underline flex items-center gap-1"
              >
                <span>Browse All 33 Wards</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
