'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Phone,
  ShieldCheck,
  Clock,
  MapPin,
  AlertTriangle,
  Search,
  Filter,
  Info,
  CheckCircle2,
  HeartPulse,
  Flame,
  Shield,
  Building,
  RefreshCw,
} from 'lucide-react';
import { EmergencyContact } from '@/types';
import { INITIAL_EMERGENCY_CONTACTS } from '@/lib/emergencyStore';

const CATEGORIES = [
  { id: 'ALL', label: 'All Services' },
  { id: 'Ambulance', label: 'Ambulance Providers' },
  { id: 'Hospital', label: 'Hospitals & Casualty' },
  { id: 'Police', label: 'Police Assistance' },
  { id: 'Fire', label: 'Fire & Rescue' },
  { id: 'Municipal', label: 'Municipal Helpline' },
];

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/emergency');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setContacts(data.data);
      }
    } catch {
      // Retain fallback initial data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Section */}
        <div className="rounded-3xl bg-white border border-[#E8E5DF] p-6 sm:p-8 lg:p-10 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-xs font-bold text-[#E66A32]">
                <AlertTriangle className="w-4 h-4 text-[#E66A32]" />
                <span className="uppercase tracking-wider text-[11px]">24/7 Verified Emergency Directory</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Emergency &amp; Ambulance Services in Korutla
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] max-w-2xl leading-relaxed">
                Direct phone lines for government ambulance dispatch, 24/7 casualty trauma centers, police control room, fire brigade, and civic disaster response. All phone numbers are verified public records.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchContacts}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-[#E8E5DF] bg-white hover:bg-[#FAF7F2] text-xs font-bold text-[#26352D] flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#E66A32]' : ''}`} />
                <span>Refresh Directory</span>
              </button>
            </div>
          </div>

          {/* Quick Dial Action Grid (High Contrast Mobile First) */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#E8E5DF]">
            <a
              href="tel:108"
              className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#E66A32] text-center hover:bg-[#F3ECE0] transition-colors flex flex-col items-center justify-center"
            >
              <span className="text-[11px] font-bold text-[#647067] uppercase">Emergency Ambulance</span>
              <span className="text-3xl font-black text-[#E66A32] my-1">108</span>
              <span className="text-xs font-bold text-[#26352D] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#E66A32]" /> Tap to Call 108
              </span>
            </a>

            <a
              href="tel:100"
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] text-center hover:border-[#26352D] transition-colors flex flex-col items-center justify-center"
            >
              <span className="text-[11px] font-bold text-[#647067] uppercase">Police Control Desk</span>
              <span className="text-3xl font-black text-[#26352D] my-1">100</span>
              <span className="text-xs font-bold text-[#26352D] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#26352D]" /> Tap to Call 100
              </span>
            </a>

            <a
              href="tel:101"
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] text-center hover:border-[#26352D] transition-colors flex flex-col items-center justify-center"
            >
              <span className="text-[11px] font-bold text-[#647067] uppercase">Fire &amp; Rescue</span>
              <span className="text-3xl font-black text-[#26352D] my-1">101</span>
              <span className="text-xs font-bold text-[#26352D] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#26352D]" /> Tap to Call 101
              </span>
            </a>

            <a
              href="tel:08725252300"
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] text-center hover:border-[#26352D] transition-colors flex flex-col items-center justify-center"
            >
              <span className="text-[11px] font-bold text-[#647067] uppercase">Govt Area Hospital</span>
              <span className="text-lg font-black text-[#26352D] my-1 truncate max-w-full">08725-252300</span>
              <span className="text-xs font-bold text-[#26352D] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#26352D]" /> 24/7 Casualty
              </span>
            </a>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#647067] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by provider, road, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E5DF] text-xs text-[#26352D] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#E66A32]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-[#647067] shrink-0 mr-1" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#26352D] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Listings */}
        {loading ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-[#E8E5DF]">
            <RefreshCw className="w-6 h-6 animate-spin text-[#E66A32] mx-auto mb-2" />
            <p className="text-xs text-[#647067] font-semibold">Loading verified emergency providers...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          /* Honest Empty State */
          <div className="p-12 sm:p-16 text-center bg-white rounded-3xl border border-[#E8E5DF] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] flex items-center justify-center mx-auto text-[#647067]">
              <AlertTriangle className="w-6 h-6 text-[#E66A32]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#26352D]">No Emergency Records Found</h3>
              <p className="text-xs text-[#647067] max-w-md mx-auto mt-1">
                No verified records match your current filter or search query. We do not display unverified or placeholder numbers.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] max-w-sm mx-auto text-xs text-[#26352D] space-y-1">
              <p className="font-bold">For Immediate Life-Saving Assistance in Korutla:</p>
              <p className="text-[#647067]">Ambulance: <a href="tel:108" className="font-bold text-[#E66A32] underline">108</a></p>
              <p className="text-[#647067]">Police: <a href="tel:100" className="font-bold text-[#26352D] underline">100</a></p>
            </div>
            <button
              onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#26352D] text-white text-xs font-bold hover:bg-[#1C2721] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-6 rounded-3xl bg-white border border-[#E8E5DF] shadow-xs flex flex-col justify-between gap-5 transition-all hover:border-[#26352D] hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-[#26352D] text-white text-[10px] font-extrabold uppercase tracking-wide">
                        {contact.category}
                      </span>
                      {contact.isVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E5DF] text-[10px] font-bold text-[#26352D]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Verified Public Record</span>
                        </span>
                      )}
                    </div>

                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                      contact.available24x7 ? 'text-emerald-800' : 'text-[#647067]'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{contact.timing || (contact.available24x7 ? '24/7 Available' : 'Office Daytime')}</span>
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-[#26352D]">
                      {contact.name}
                    </h2>
                    <p className="text-xs text-[#647067] flex items-center gap-1.5 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#647067] shrink-0" />
                      <span>{contact.address}</span>
                    </p>
                  </div>

                  {contact.notes && (
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] text-xs text-[#647067] leading-relaxed">
                      {contact.notes}
                    </div>
                  )}
                </div>

                {/* Bottom Call Bar */}
                <div className="pt-3 border-t border-[#E8E5DF] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#647067] block uppercase font-bold">Emergency Phone:</span>
                    <strong className="text-base font-black text-[#26352D]">{contact.phone}</strong>
                  </div>

                  <a
                    href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white text-xs font-extrabold shadow-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Tap to Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear Emergency Guidance Protocol */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E5DF] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#26352D]">
            <Info className="w-5 h-5 text-[#E66A32]" />
            <h2 className="text-lg font-black">Official Emergency Protocols &amp; Guidance</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#647067]">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-[#26352D] text-white flex items-center justify-center font-bold text-[11px]">1</span>
              <h4 className="font-bold text-[#26352D]">Assess Patient &amp; Scene</h4>
              <p className="text-[11px] leading-relaxed">
                Check consciousness, severe bleeding, or breathing difficulty. Do not move spinal injury victims unless there is immediate danger.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-[#26352D] text-white flex items-center justify-center font-bold text-[11px]">2</span>
              <h4 className="font-bold text-[#26352D]">Dial 108 Immediately</h4>
              <p className="text-[11px] leading-relaxed">
                Stay on the line. Clearly state your location, street name, and prominent Korutla landmark (e.g. Bus Stand, High School Road).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-[#26352D] text-white flex items-center justify-center font-bold text-[11px]">3</span>
              <h4 className="font-bold text-[#26352D]">Send a Guide to Main Road</h4>
              <p className="text-[11px] leading-relaxed">
                Have a family member or bystander stand at the main colony junction to flag down the 108 ambulance vehicle.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-[#26352D] text-white flex items-center justify-center font-bold text-[11px]">4</span>
              <h4 className="font-bold text-[#26352D]">Prepare Medical Records</h4>
              <p className="text-[11px] leading-relaxed">
                Gather existing prescription papers, Aadhaar card, or Aarogyasri / Ayushman Bharat health cards for smooth hospital admission.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-[#647067] border-t border-[#E8E5DF]">
            <span>
              <strong>Public Record Verification:</strong> Records are maintained and verified by local administrators. No sponsored rankings are used for emergency numbers.
            </span>
            <Link
              href="/admin/emergency"
              className="text-[#E66A32] font-bold hover:underline shrink-0"
            >
              Authorized Admin Management →
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
