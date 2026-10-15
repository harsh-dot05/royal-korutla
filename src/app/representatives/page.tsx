'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PublicRepresentative } from '@/types';
import {
  Users,
  Search,
  ShieldCheck,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  ExternalLink,
  CheckCircle2,
  Landmark,
  User,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function RepresentativesPage() {
  const [representatives, setRepresentatives] = useState<PublicRepresentative[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'pending'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/representatives');
        const json = await res.json();
        if (json.success && json.data) {
          setRepresentatives(json.data.all || []);
        }
      } catch (err) {
        console.error('Failed to load representatives:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Split records into exact required section order
  const mla = useMemo(
    () => representatives.find((r) => r.role === 'MLA'),
    [representatives]
  );

  const chairman = useMemo(
    () => representatives.find((r) => r.role === 'MUNICIPAL_CHAIRMAN'),
    [representatives]
  );

  const wardCouncillors = useMemo(() => {
    return representatives
      .filter((r) => r.role === 'WARD_COUNCILLOR')
      .sort((a, b) => (a.wardNumber || 0) - (b.wardNumber || 0));
  }, [representatives]);

  // Filtered ward councillors for Section 3
  const filteredCouncillors = useMemo(() => {
    return wardCouncillors.filter((c) => {
      // Filter by status
      if (filterMode === 'verified' && !c.isVerified) return false;
      if (filterMode === 'pending' && c.isVerified) return false;

      // Filter by search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const wardStr = c.wardNumber ? `ward ${c.wardNumber}` : '';
      const wardNumStr = c.wardNumber ? `${c.wardNumber}` : '';
      const nameMatch = c.name?.toLowerCase().includes(q) || false;
      const areaMatch = c.areaName?.toLowerCase().includes(q) || false;
      const wardMatch = wardStr.includes(q) || wardNumStr === q;

      return nameMatch || areaMatch || wardMatch;
    });
  }, [wardCouncillors, searchQuery, filterMode]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Page Breadcrumb & Header */}
        <section aria-labelledby="page-heading">
          <nav className="flex items-center gap-2 text-xs text-[#647067] mb-3" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#E66A32] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#26352D] font-semibold">Public Representatives</span>
          </nav>

          <div className="bg-white border border-[#E8E5DF] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold mb-3">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Korutla Municipal Directory</span>
                </div>
                <h1 id="page-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#26352D] tracking-tight">
                  Public Representatives of Korutla
                </h1>
                <p className="mt-2 text-sm sm:text-base text-[#647067] leading-relaxed">
                  Official directory of Korutla Assembly MLA, Municipal Chairperson, and Ward Councillors across all 33 municipal wards. Designed for civic transparency and resident convenience.
                </p>
              </div>

              {/* Verified Records Transparency Notice */}
              <div className="bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl p-4 md:max-w-xs shrink-0 text-xs text-[#647067] space-y-1.5">
                <div className="flex items-center gap-2 text-[#26352D] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#26352D]" />
                  <span>Civic Information Policy</span>
                </div>
                <p>
                  Details are published strictly upon administrative verification. Profiles pending official gazette notifications remain visibly tagged.
                </p>
                <div className="pt-1">
                  <Link
                    href="/admin/representatives"
                    className="inline-flex items-center gap-1 text-[#E66A32] font-semibold hover:underline text-[11px]"
                  >
                    <span>Admin Portal Sign-in</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 1: MLA PROFILE — FIRST                               */}
        {/* ============================================================ */}
        <section aria-labelledby="mla-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E66A32] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                01
              </div>
              <div>
                <h2 id="mla-heading" className="text-xl sm:text-2xl font-bold text-[#26352D] tracking-tight">
                  Member of Legislative Assembly (MLA)
                </h2>
                <p className="text-xs text-[#647067]">
                  Korutla Assembly Constituency (Telangana State Legislative Assembly)
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF6F0] text-[#E66A32] border border-[#F8CFBE]">
              Constituency Representative
            </span>
          </div>

          <div className="bg-white border border-[#E8E5DF] rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#D5D1C8] transition-all duration-300">
            {mla?.isVerified && mla.name ? (
              /* Verified MLA Profile */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 lg:col-span-3 flex justify-center">
                  <div className="relative w-40 h-48 sm:w-48 sm:h-56 rounded-xl overflow-hidden border border-[#E8E5DF] bg-[#FAF7F2] shadow-xs">
                    {mla.photoUrl ? (
                      <Image
                        src={mla.photoUrl}
                        alt={mla.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 160px, 192px"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#647067]">
                        <User className="w-16 h-16 stroke-1 text-[#647067]" />
                        <span className="text-xs font-semibold mt-2">Verified Official</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-8 lg:col-span-9 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Public Record</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#26352D] tracking-tight">
                      {mla.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#E66A32] mt-0.5">
                      {mla.designation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#647067] pt-2 border-t border-[#E8E5DF]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#E66A32] shrink-0" />
                      <span>{mla.areaName || 'Korutla, Metpally, Ibrahimpatnam & Medipally'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#E66A32] shrink-0" />
                      <span>{mla.termPeriod || 'Current Assembly Term'}</span>
                    </div>
                    {mla.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#E66A32] shrink-0" />
                        <a href={`tel:${mla.phone}`} className="text-[#26352D] font-medium hover:text-[#E66A32]">
                          {mla.phone}
                        </a>
                      </div>
                    )}
                    {mla.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#E66A32] shrink-0" />
                        <a href={`mailto:${mla.email}`} className="text-[#26352D] font-medium hover:text-[#E66A32]">
                          {mla.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {mla.officeAddress && (
                    <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E5DF] text-xs">
                      <span className="font-semibold text-[#26352D]">Public Camp Office: </span>
                      <span className="text-[#647067]">{mla.officeAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Honest Empty State for MLA (No invented data) */
              <div className="text-center py-8 sm:py-10 max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF7F2] border border-[#E8E5DF] flex items-center justify-center text-[#647067]">
                  <Landmark className="w-7 h-7 text-[#647067]" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] text-[#647067] border border-[#E8E5DF] mb-2">
                    Official Gazette Record Pending
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#26352D]">
                    Korutla MLA Profile Awaiting Verification
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#647067] leading-relaxed">
                    Official representative details, camp office address, and verified citizen grievance numbers will appear here once officially validated by the administration.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/admin/representatives"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#26352D] hover:bg-[#1E2B24] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E66A32]" />
                    <span>Admin: Update MLA Record</span>
                  </Link>
                  <a
                    href="https://telangana.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#26352D] border border-[#E8E5DF] text-xs font-semibold transition-colors"
                  >
                    <span>Telangana Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#647067]" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: MUNICIPAL CHAIRMAN PROFILE — SECOND               */}
        {/* ============================================================ */}
        <section aria-labelledby="chairman-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#26352D] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                02
              </div>
              <div>
                <h2 id="chairman-heading" className="text-xl sm:text-2xl font-bold text-[#26352D] tracking-tight">
                  Municipal Chairperson / Chairman
                </h2>
                <p className="text-xs text-[#647067]">
                  Korutla Municipality (Urban Civic Governance)
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] text-[#26352D] border border-[#E8E5DF]">
              Municipal Civic Head
            </span>
          </div>

          <div className="bg-white border border-[#E8E5DF] rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#D5D1C8] transition-all duration-300">
            {chairman?.isVerified && chairman.name ? (
              /* Verified Chairman Profile */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 lg:col-span-3 flex justify-center">
                  <div className="relative w-40 h-48 sm:w-48 sm:h-56 rounded-xl overflow-hidden border border-[#E8E5DF] bg-[#FAF7F2] shadow-xs">
                    {chairman.photoUrl ? (
                      <Image
                        src={chairman.photoUrl}
                        alt={chairman.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 160px, 192px"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#647067]">
                        <User className="w-16 h-16 stroke-1 text-[#647067]" />
                        <span className="text-xs font-semibold mt-2">Municipal Chairperson</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-8 lg:col-span-9 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Civic Record</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#26352D] tracking-tight">
                      {chairman.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#E66A32] mt-0.5">
                      {chairman.designation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#647067] pt-2 border-t border-[#E8E5DF]">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#26352D] shrink-0" />
                      <span>{chairman.areaName || 'Korutla Municipal Council Building'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#26352D] shrink-0" />
                      <span>{chairman.termPeriod || 'Current Municipal Council Term'}</span>
                    </div>
                    {chairman.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#E66A32] shrink-0" />
                        <a href={`tel:${chairman.phone}`} className="text-[#26352D] font-medium hover:text-[#E66A32]">
                          {chairman.phone}
                        </a>
                      </div>
                    )}
                    {chairman.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#E66A32] shrink-0" />
                        <a href={`mailto:${chairman.email}`} className="text-[#26352D] font-medium hover:text-[#E66A32]">
                          {chairman.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {chairman.officeAddress && (
                    <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E5DF] text-xs">
                      <span className="font-semibold text-[#26352D]">Municipal Office: </span>
                      <span className="text-[#647067]">{chairman.officeAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Honest Empty State for Municipal Chairman (No invented data) */
              <div className="text-center py-8 sm:py-10 max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF7F2] border border-[#E8E5DF] flex items-center justify-center text-[#647067]">
                  <Building2 className="w-7 h-7 text-[#647067]" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] text-[#647067] border border-[#E8E5DF] mb-2">
                    Official Council Record Pending
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#26352D]">
                    Municipal Chairperson Profile Awaiting Verification
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#647067] leading-relaxed">
                    The Municipal Chairperson is the civic head representing all 33 wards of Korutla town. Official profile and office contact hours will appear here once authenticated.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/admin/representatives"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#26352D] hover:bg-[#1E2B24] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E66A32]" />
                    <span>Admin: Update Chairman Record</span>
                  </Link>
                  <a
                    href="https://cdma.telangana.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#26352D] border border-[#E8E5DF] text-xs font-semibold transition-colors"
                  >
                    <span>CDMA Telangana</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#647067]" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: ALL 33 WARD COUNCILLORS — THIRD                   */}
        {/* ============================================================ */}
        <section aria-labelledby="councillors-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E5DF] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E66A32] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                03
              </div>
              <div>
                <h2 id="councillors-heading" className="text-xl sm:text-2xl font-bold text-[#26352D] tracking-tight">
                  All 33 Municipal Ward Councillors
                </h2>
                <p className="text-xs text-[#647067]">
                  Wards numbered 1 through 33 representing Korutla Town neighborhoods
                </p>
              </div>
            </div>

            {/* Quick Count Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E8E5DF] text-xs font-bold text-[#26352D] shadow-xs">
              <Users className="w-4 h-4 text-[#E66A32]" />
              <span>33 Registered Wards</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white border border-[#E8E5DF] rounded-xl p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#647067] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ward number (e.g. 5, 18) or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#26352D] placeholder-[#647067] focus:outline-none transition-colors"
                aria-label="Search ward councillors"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterMode === 'all'
                    ? 'bg-[#26352D] text-white'
                    : 'bg-[#FAF7F2] text-[#647067] hover:bg-[#F4EFE7]'
                }`}
              >
                All 33 Wards ({wardCouncillors.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('verified')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterMode === 'verified'
                    ? 'bg-[#26352D] text-white'
                    : 'bg-[#FAF7F2] text-[#647067] hover:bg-[#F4EFE7]'
                }`}
              >
                Verified Only ({wardCouncillors.filter((w) => w.isVerified).length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterMode === 'pending'
                    ? 'bg-[#26352D] text-white'
                    : 'bg-[#FAF7F2] text-[#647067] hover:bg-[#F4EFE7]'
                }`}
              >
                Pending Verification ({wardCouncillors.filter((w) => !w.isVerified).length})
              </button>
            </div>
          </div>

          {/* 33 Wards Responsive Grid with 3D Depth Card Styling */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#E8E5DF] p-5 h-48 animate-pulse space-y-3">
                  <div className="w-16 h-6 bg-[#FAF7F2] rounded" />
                  <div className="w-3/4 h-5 bg-[#FAF7F2] rounded" />
                  <div className="w-1/2 h-4 bg-[#FAF7F2] rounded" />
                </div>
              ))}
            </div>
          ) : filteredCouncillors.length === 0 ? (
            <div className="bg-white border border-[#E8E5DF] rounded-2xl p-8 text-center max-w-md mx-auto space-y-3">
              <AlertCircle className="w-8 h-8 text-[#647067] mx-auto" />
              <h3 className="font-bold text-[#26352D]">No matching ward records</h3>
              <p className="text-xs text-[#647067]">
                No ward matches your search query &ldquo;{searchQuery}&rdquo;. Try another ward number between 1 and 33.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterMode('all');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#FAF7F2] text-[#26352D] font-bold text-xs hover:bg-[#F4EFE7]"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCouncillors.map((councillor) => {
                const wardNum = councillor.wardNumber || 0;
                const paddedWard = String(wardNum).padStart(2, '0');

                return (
                  <article
                    key={councillor.id}
                    className="group bg-white border border-[#E8E5DF] rounded-xl p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[#D5D1C8] flex flex-col justify-between"
                    style={{ perspective: '1000px' }}
                  >
                    <div>
                      {/* Card Header: Ward Number & Status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] font-black text-xs tracking-wider">
                          <span>WARD {paddedWard}</span>
                        </div>

                        {councillor.isVerified && councillor.name ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#647067] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E5DF]">
                            <span>Pending Details</span>
                          </span>
                        )}
                      </div>

                      {/* Councillor Details or Honest Empty State */}
                      {councillor.isVerified && councillor.name ? (
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#E8E5DF] shrink-0">
                              {councillor.photoUrl ? (
                                <Image
                                  src={councillor.photoUrl}
                                  alt={councillor.name}
                                  fill
                                  className="object-cover"
                                  sizes="44px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#647067]">
                                  <User className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-sm text-[#26352D] truncate">
                                {councillor.name}
                              </h3>
                              <p className="text-[11px] text-[#647067] font-medium">
                                Ward {wardNum} Councillor
                              </p>
                            </div>
                          </div>

                          <div className="text-xs text-[#647067] space-y-1 pt-2 border-t border-[#E8E5DF]">
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                              <span className="truncate">{councillor.areaName || `Ward ${wardNum} Area`}</span>
                            </div>
                            {councillor.phone && (
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                                <a
                                  href={`tel:${councillor.phone}`}
                                  className="text-[#26352D] font-medium hover:text-[#E66A32]"
                                >
                                  {councillor.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Honest Empty State for Unverified Ward */
                        <div className="space-y-2 py-1">
                          <div className="flex items-start gap-3">
                            <div className="w-11 h-11 rounded-lg bg-[#FAF7F2] border border-[#E8E5DF] flex items-center justify-center text-[#647067] shrink-0">
                              <User className="w-5 h-5 text-[#647067]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm text-[#26352D]">
                                Ward {wardNum} Councillor
                              </h3>
                              <p className="text-[11px] text-[#647067]">
                                Official Profile Pending
                              </p>
                            </div>
                          </div>

                          <p className="text-[11px] text-[#647067] leading-relaxed pt-1">
                            {councillor.areaName || `Ward ${wardNum} jurisdiction`}. Details awaiting administrative entry.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Admin Link or Call Button */}
                    <div className="mt-4 pt-3 border-t border-[#E8E5DF] flex items-center justify-between text-[11px]">
                      <span className="text-[#647067]">Ward #{wardNum}</span>
                      <Link
                        href={`/admin/representatives?ward=${wardNum}`}
                        className="text-[#26352D] hover:text-[#E66A32] font-semibold transition-colors flex items-center gap-1"
                      >
                        <span>Manage slot</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: A WIDE KORUTLA HERO IMAGE — AFTER COUNCILLORS     */}
        {/* ============================================================ */}
        <section aria-labelledby="korutla-hero-heading" className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-[#E8E5DF] bg-[#26352D] shadow-xs">
            {/* Panoramic Wide Hero Image */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full">
              <Image
                src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&auto=format&fit=crop&q=80"
                alt="Korutla Town Landscape and Civic Heritage"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center"
              />
              {/* Solid dark contrast overlay (no gradient) */}
              <div className="absolute inset-0 bg-[#16201A]/80" />

              {/* Overlay Content */}
              <div className="relative h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-white">
                <div className="max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E66A32] text-white text-xs font-extrabold w-fit">
                    <Landmark className="w-3.5 h-3.5" />
                    <span>CIVIC HERITAGE &amp; GOVERNANCE</span>
                  </div>
                  <h2 id="korutla-hero-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                    Historic Korutla: Dedicated to Citizen Service
                  </h2>
                  <p className="text-xs sm:text-sm text-[#FAF7F2]/90 leading-relaxed max-w-xl">
                    Located in Jagtial District of Telangana, Korutla Municipality operates across 33 municipal wards, serving citizens with sanitation, clean drinking water, public infrastructure, and transparent civic administration.
                  </p>
                </div>

                {/* Key Civic Statistics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/20">
                  <div className="bg-black/30 backdrop-blur-xs rounded-lg p-2.5 sm:p-3 border border-white/10">
                    <div className="text-lg sm:text-2xl font-black text-[#E66A32]">33</div>
                    <div className="text-[11px] font-medium text-white/80">Municipal Wards</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-xs rounded-lg p-2.5 sm:p-3 border border-white/10">
                    <div className="text-lg sm:text-2xl font-black text-white">1988</div>
                    <div className="text-[11px] font-medium text-white/80">Municipality Estd.</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-xs rounded-lg p-2.5 sm:p-3 border border-white/10">
                    <div className="text-lg sm:text-2xl font-black text-white">505326</div>
                    <div className="text-[11px] font-medium text-white/80">Postal PIN Code</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-xs rounded-lg p-2.5 sm:p-3 border border-white/10">
                    <div className="text-lg sm:text-2xl font-black text-white">1800-425-1980</div>
                    <div className="text-[11px] font-medium text-white/80">CDMA Toll Free</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
