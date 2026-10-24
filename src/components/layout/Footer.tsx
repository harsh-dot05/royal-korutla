'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, MapPin, MessageCircle, Heart, Shield, Phone } from 'lucide-react';
import {
  getRoyalKorutlaWhatsAppUrl,
  WHATSAPP_PREFILLED_MESSAGES,
  ROYAL_KORUTLA_PHONE_DISPLAY,
} from '@/config/contact';

export const Footer: React.FC = () => {
  const whatsappUrl = getRoyalKorutlaWhatsAppUrl(WHATSAPP_PREFILLED_MESSAGES.footerSupport);

  return (
    <footer className="bg-white border-t border-[#E8E5DF] text-[#647067] pt-10 pb-20 md:pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-8 border-b border-[#E8E5DF]">
          {/* Col 1: Branding & Intro */}
          <div className="sm:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#E66A32] text-white shadow-xs">
                <Crown className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl text-[#26352D] tracking-tight">
                Royal <span className="text-[#E66A32]">Korutla</span>
              </span>
            </div>

            <p className="text-xs text-[#647067] leading-relaxed font-normal max-w-sm">
              Korutla’s dedicated platform for everything in Korutla — connecting residents with local shops, food outlets, hospitals, services, real estate, and job opportunities.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#26352D] font-medium">
              <MapPin className="w-4 h-4 text-[#E66A32] shrink-0" />
              <span>Korutla, Jagtial District, Telangana - 505326</span>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#FFF6F0] text-[#26352D] hover:text-[#E66A32] border border-[#E8E5DF] hover:border-[#F8CFBE] text-xs font-bold transition-all focus:outline-none"
                aria-label={`Contact Royal Korutla Support on WhatsApp ${ROYAL_KORUTLA_PHONE_DISPLAY}`}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: {ROYAL_KORUTLA_PHONE_DISPLAY}</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#647067] hover:text-[#26352D] border border-[#E8E5DF] text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Contact Page</span>
              </Link>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-xs font-bold text-[#26352D] uppercase tracking-wider mb-3">
              Browse Categories
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/food" className="hover:text-[#E66A32] transition-colors">
                  Food &amp; Dining
                </Link>
              </li>
              <li>
                <Link href="/groceries" className="hover:text-[#E66A32] transition-colors">
                  Groceries &amp; Marts
                </Link>
              </li>
              <li>
                <Link href="/clothing" className="hover:text-[#E66A32] transition-colors">
                  Clothing Stores
                </Link>
              </li>
              <li>
                <Link href="/shopping" className="hover:text-[#E66A32] transition-colors">
                  Shopping &amp; Apparel
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#E66A32] transition-colors">
                  Local Services
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="hover:text-[#BE123C] text-[#BE123C] font-semibold transition-colors">
                  Emergency 24/7
                </Link>
              </li>
              <li>
                <Link href="/hospitals" className="hover:text-[#E66A32] transition-colors">
                  Hospitals &amp; Doctors
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Discovery & Community */}
          <div>
            <h3 className="text-xs font-bold text-[#26352D] uppercase tracking-wider mb-3">
              Town Services
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/jobs" className="hover:text-[#E66A32] transition-colors">
                  Local Jobs
                </Link>
              </li>
              <li>
                <Link href="/real-estate" className="hover:text-[#E66A32] transition-colors">
                  Real Estate &amp; Plots
                </Link>
              </li>
              <li>
                <Link href="/photography" className="hover:text-[#E66A32] transition-colors">
                  Photography &amp; Studios
                </Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-[#E66A32] transition-colors">
                  Education &amp; Tuition
                </Link>
              </li>
              <li>
                <Link href="/public-places" className="hover:text-[#E66A32] transition-colors">
                  Public Places &amp; Parks
                </Link>
              </li>
              <li>
                <Link href="/representatives" className="hover:text-[#E66A32] transition-colors">
                  Public Representatives
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Rewards & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#26352D] uppercase tracking-wider mb-3">
              Platform &amp; Rewards
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/rewards" className="hover:text-[#E66A32] transition-colors">
                  Royal Points Rewards
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-[#E66A32] transition-colors">
                  Offers &amp; Promotions
                </Link>
              </li>
              <li>
                <Link href="/businesses" className="hover:text-[#E66A32] transition-colors">
                  Featured Businesses
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#E66A32] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E66A32] transition-colors">
                  Contact &amp; WhatsApp Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#E66A32] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/business/login" className="hover:text-[#E66A32] font-semibold transition-colors">
                  Merchant / Business Login
                </Link>
              </li>
            </ul>

            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E5DF] text-xs text-[#26352D] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Shield className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                <span>Verified Local Town Directory</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#647067]">
                Connecting residents and local businesses across Korutla town.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row (NO admin login in public footer) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#647067] font-medium">
          <p>© {new Date().getFullYear()} Royal Korutla. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <Link href="/privacy" className="hover:text-[#E66A32] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#D5D1C8]" aria-hidden="true">•</span>
            <Link href="/terms" className="hover:text-[#E66A32] transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-[#D5D1C8]" aria-hidden="true">•</span>
            <span className="flex items-center gap-1">
              <span>Made for Korutla with</span>
              <Heart className="w-3.5 h-3.5 text-[#E66A32] fill-[#E66A32]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
