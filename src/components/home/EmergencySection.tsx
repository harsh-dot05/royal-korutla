'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Phone,
  ShieldCheck,
  Clock,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { EmergencyContact } from '@/types';
import { INITIAL_EMERGENCY_CONTACTS } from '@/lib/emergencyStore';

export const EmergencySection: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);

  useEffect(() => {
    fetch('/api/emergency')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setContacts(json.data);
        }
      })
      .catch(() => {
        // Fallback to initial verified data
      });
  }, []);

  // Display top priority contacts on homepage (Ambulance, Hospital, Police, Fire)
  const priorityContacts = contacts.slice(0, 4);

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Emergency Services">
      <div className="rounded-3xl bg-white border border-[#E8E5DF] shadow-md p-6 sm:p-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E5DF] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-xs font-bold text-[#E66A32] mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E66A32]" />
              <span className="uppercase tracking-wider text-[10px]">Verified Town Assistance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#26352D] tracking-tight">
              Emergency &amp; Ambulance Services
            </h2>
            <p className="text-xs sm:text-sm text-[#647067] mt-1">
              Official public emergency helplines, ambulance dispatch, and 24/7 hospital casualty units in Korutla.
            </p>
          </div>

          <Link
            href="/emergency"
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#26352D] bg-[#26352D] hover:bg-[#1C2721] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <span>Full Emergency Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Tap-To-Call Direct Strip (Mobile First Optimized) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            href="tel:108"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-[#E66A32] text-center hover:bg-[#F3ECE0] transition-colors group"
          >
            <span className="text-[10px] font-bold text-[#647067] uppercase tracking-wide">Ambulance</span>
            <span className="text-2xl sm:text-3xl font-black text-[#E66A32] my-0.5 tracking-tight">108</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#26352D]">
              <Phone className="w-3 h-3 text-[#E66A32]" />
              <span>Tap to Call</span>
            </div>
          </a>

          <a
            href="tel:100"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] text-center hover:border-[#26352D] transition-colors"
          >
            <span className="text-[10px] font-bold text-[#647067] uppercase tracking-wide">Police</span>
            <span className="text-2xl sm:text-3xl font-black text-[#26352D] my-0.5 tracking-tight">100</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#26352D]">
              <Phone className="w-3 h-3 text-[#26352D]" />
              <span>Town Police</span>
            </div>
          </a>

          <a
            href="tel:101"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] text-center hover:border-[#26352D] transition-colors"
          >
            <span className="text-[10px] font-bold text-[#647067] uppercase tracking-wide">Fire Rescue</span>
            <span className="text-2xl sm:text-3xl font-black text-[#26352D] my-0.5 tracking-tight">101</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#26352D]">
              <Phone className="w-3 h-3 text-[#26352D]" />
              <span>Fire Station</span>
            </div>
          </a>

          <a
            href="tel:08725252300"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] text-center hover:border-[#26352D] transition-colors"
          >
            <span className="text-[10px] font-bold text-[#647067] uppercase tracking-wide">Govt Casualty</span>
            <span className="text-lg sm:text-xl font-black text-[#26352D] my-1 truncate max-w-full">08725-252300</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#26352D]">
              <Phone className="w-3 h-3 text-[#26352D]" />
              <span>Hospital Desk</span>
            </div>
          </a>
        </div>

        {/* Priority Verified Emergency Cards */}
        {priorityContacts.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF7F2] rounded-2xl border border-[#E8E5DF] text-xs text-[#647067] space-y-2">
            <AlertTriangle className="w-6 h-6 text-[#E66A32] mx-auto" />
            <p className="font-bold text-[#26352D]">No Emergency Records Found</p>
            <p className="text-[11px]">For immediate life-threatening assistance in Korutla, call toll-free ambulance <a href="tel:108" className="font-bold text-[#E66A32] underline">108</a> or police <a href="tel:100" className="font-bold text-[#26352D] underline">100</a>.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {priorityContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] flex flex-col justify-between gap-4 transition-all hover:border-[#26352D]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#26352D] text-white text-[10px] font-extrabold uppercase tracking-wide">
                        {contact.category}
                      </span>
                      {contact.isVerified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#E8E5DF] text-[10px] font-bold text-[#26352D]">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          <span>Verified Public Number</span>
                        </span>
                      )}
                    </div>

                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                      contact.available24x7 ? 'text-emerald-800' : 'text-[#647067]'
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span>{contact.timing || (contact.available24x7 ? '24/7 Service' : 'Daytime Hours')}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#26352D]">
                    {contact.name}
                  </h3>

                  <p className="text-xs text-[#647067] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#647067] shrink-0" />
                    <span>{contact.address}</span>
                  </p>

                  {contact.notes && (
                    <p className="text-[11px] text-[#647067] leading-relaxed pt-1">
                      {contact.notes}
                    </p>
                  )}
                </div>

                {/* Call Action Button */}
                <div className="pt-2 border-t border-[#E8E5DF] flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-[#647067] block text-[10px]">Helpline / Direct Line:</span>
                    <strong className="text-sm font-black text-[#26352D]">{contact.phone}</strong>
                  </div>

                  <a
                    href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear Emergency Guidance Notice */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#26352D] shrink-0 mt-0.5" />
          <div className="text-xs text-[#647067] leading-relaxed">
            <p className="font-bold text-[#26352D] mb-0.5">Critical Emergency Guidance for Korutla Residents:</p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>For immediate life-threatening medical emergencies or road accidents, dial <strong>108</strong> without delay.</li>
              <li>Clearly state your colony name, nearby landmark (e.g. Bus Stand, High School Road, Old Police Station), and patient symptoms.</li>
              <li>Send someone to wait at the main colony junction to guide the emergency ambulance crew directly to the spot.</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};
