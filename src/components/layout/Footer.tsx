'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, MapPin, MessageCircle, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const rawNumber = process.env.NEXT_PUBLIC_ROYAL_KORUTLA_WHATSAPP || '';
  const whatsappNumber = rawNumber.replace(/[^0-9]/g, '');
  const defaultMsg = encodeURIComponent(
    'Hi Royal Korutla! I have an inquiry about local businesses, services, or platform information in Korutla.'
  );
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${defaultMsg}`
    : 'https://wa.me/?text=' + defaultMsg;

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-8 border-b border-slate-200">
          {/* Col 1: Branding & Intro */}
          <div className="sm:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-xs">
                <Crown className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                Royal <span className="text-blue-600">Korutla</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal max-w-sm">
              Korutla’s dedicated local discovery platform connecting residents with verified shops, food outlets, hospitals, services, real estate, and job opportunities.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Korutla, Jagtial District, Telangana - 505326</span>
            </div>

            <div className="pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 hover:border-blue-200 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                aria-label="Contact Royal Korutla Support on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>

          {/* Col 2: Explore Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Explore Links
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link
                  href="/food"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Food &amp; Dining
                </Link>
              </li>
              <li>
                <Link
                  href="/groceries"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Groceries
                </Link>
              </li>
              <li>
                <Link
                  href="/shopping"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Shopping
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/hospitals"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Hospitals
                </Link>
              </li>
              <li>
                <Link
                  href="/education"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Education
                </Link>
              </li>
              <li>
                <Link
                  href="/public-places"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Public Places
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/real-estate"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Real Estate
                </Link>
              </li>
              <li>
                <Link
                  href="/photography"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Photography
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Royal Korutla Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Royal Korutla
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link
                  href="/rewards"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Royal Points
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Offers &amp; Promotions
                </Link>
              </li>
              <li>
                <Link
                  href="/businesses"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Featured Businesses
                </Link>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Legal &amp; Safety
            </h4>
            <ul className="space-y-2 text-xs font-medium mb-3">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Verified Local Listings</span>
              </div>
              <p className="text-[11px] leading-normal font-medium text-slate-600">
                Connecting residents and businesses across Korutla town safely.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Royal Korutla Directory Portal. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <Link
              href="/privacy"
              className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/terms"
              className="hover:text-blue-600 transition-colors focus:outline-none focus:underline"
            >
              Terms &amp; Conditions
            </Link>
            <span className="text-slate-300">•</span>
            <p className="flex items-center gap-1">
              <span>Built for Korutla with</span>
              <Heart className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            </p>
            <span className="text-slate-300">•</span>
            <Link
              href="/admin/login"
              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors font-medium opacity-60 hover:opacity-100"
              title="Admin Access"
            >
              <Shield className="w-3 h-3" />
              <span>Owner Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
