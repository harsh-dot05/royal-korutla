'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  X,
  ChevronRight,
  MapPin,
  Utensils,
  Briefcase,
  Store,
  Wrench,
  Shirt,
  GraduationCap,
  TreePine,
  PhoneCall,
  Tag,
  Camera,
  Award,
  AlertCircle,
  Building2,
  Users,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import {
  getRoyalKorutlaWhatsAppUrl,
  WHATSAPP_PREFILLED_MESSAGES,
  ROYAL_KORUTLA_PHONE_DISPLAY,
} from '@/config/contact';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const getCategoryHref = (slug: string) => {
    switch (slug) {
      case 'food':
        return '/food';
      case 'groceries':
      case 'grocery':
        return '/groceries';
      case 'clothing':
        return '/clothing';
      case 'photography':
      case 'photography-studios':
        return '/photography';
      case 'shopping':
        return '/shopping';
      case 'services':
        return '/services';
      case 'hospitals':
        return '/hospitals';
      case 'education':
        return '/education';
      case 'public-places':
        return '/public-places';
      case 'jobs':
        return '/jobs';
      case 'real-estate':
        return '/real-estate';
      case 'offers':
        return '/offers';
      case 'rewards':
        return '/rewards';
      default:
        return `/${slug}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#26352D]/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-white border-l border-[#E8E5DF] h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DF]">
            <div>
              <span className="font-extrabold text-lg text-[#26352D]">
                Royal <span className="text-[#E66A32]">Korutla</span>
              </span>
              <p className="text-xs text-[#647067] flex items-center gap-1 mt-0.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Everything in Korutla</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#FAF7F2] text-[#647067] hover:text-[#26352D] hover:bg-[#F4EFE7] border border-[#E8E5DF]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Links */}
          <div className="py-4 space-y-1">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#FFF6F0] text-[#E66A32] font-bold text-xs border border-[#F8CFBE]"
            >
              <Home className="w-4 h-4 text-[#E66A32]" />
              <span>Home</span>
            </Link>

            <Link
              href="/rewards"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-semibold text-xs transition-colors"
            >
              <Award className="w-4 h-4 text-[#E66A32]" />
              <span>Royal Points &amp; Rewards</span>
            </Link>

            <Link
              href="/emergency"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FFF1F2] text-[#BE123C] font-bold text-xs transition-colors"
            >
              <AlertCircle className="w-4 h-4 text-[#BE123C]" />
              <span>Emergency 24/7</span>
            </Link>

            <Link
              href="/clothing"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-medium text-xs transition-colors"
            >
              <Shirt className="w-4 h-4 text-[#E66A32]" />
              <span>Clothing Stores</span>
            </Link>

            <Link
              href="/food"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-medium text-xs transition-colors"
            >
              <Utensils className="w-4 h-4 text-[#E66A32]" />
              <span>Food &amp; Dining</span>
            </Link>

            <Link
              href="/groceries"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-medium text-xs transition-colors"
            >
              <Store className="w-4 h-4 text-[#E66A32]" />
              <span>Groceries &amp; Marts</span>
            </Link>

            <Link
              href="/services"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-medium text-xs transition-colors"
            >
              <Wrench className="w-4 h-4 text-[#E66A32]" />
              <span>Services &amp; Repair</span>
            </Link>

            <Link
              href="/hospitals"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-medium text-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#E66A32]" />
              <span>Hospitals &amp; Doctors</span>
            </Link>

            <Link
              href="/jobs"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-medium text-xs transition-colors"
            >
              <Briefcase className="w-4 h-4 text-[#E66A32]" />
              <span>Local Jobs</span>
            </Link>

            <Link
              href="/real-estate"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-medium text-xs transition-colors"
            >
              <Building2 className="w-4 h-4 text-[#E66A32]" />
              <span>Real Estate</span>
            </Link>

            <Link
              href="/photography"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-medium text-xs transition-colors"
            >
              <Camera className="w-4 h-4 text-[#E66A32]" />
              <span>Photography &amp; Studios</span>
            </Link>

            <Link
              href="/offers"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-medium text-xs transition-colors"
            >
              <Tag className="w-4 h-4 text-[#E66A32]" />
              <span>Offers &amp; Promotions</span>
            </Link>

            <Link
              href="/representatives"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-medium text-xs transition-colors"
            >
              <Users className="w-4 h-4 text-[#E66A32]" />
              <span>Public Representatives</span>
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#26352D] hover:text-[#E66A32] font-medium text-xs transition-colors"
            >
              <Phone className="w-4 h-4 text-[#E66A32]" />
              <span>Contact &amp; WhatsApp Support</span>
            </Link>
          </div>

          {/* Categories List */}
          <div className="pt-3 border-t border-[#E8E5DF]">
            <span className="text-[11px] font-bold text-[#647067] uppercase tracking-wider block mb-2">
              Browse Sectors
            </span>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={getCategoryHref(cat.slug)}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-[#26352D] hover:bg-[#FAF7F2] hover:text-[#E66A32] transition-colors"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8A968D]" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info inside Drawer */}
        <div className="pt-3 border-t border-[#E8E5DF] text-center text-xs text-[#647067] font-medium space-y-2">
          <a
            href={getRoyalKorutlaWhatsAppUrl(WHATSAPP_PREFILLED_MESSAGES.defaultSupport)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>WhatsApp Support: {ROYAL_KORUTLA_PHONE_DISPLAY}</span>
          </a>
          <p className="font-bold text-[#26352D]">Royal Korutla</p>
          <p className="text-[10px] mt-0.5">Everything in Korutla</p>
        </div>
      </div>
    </div>
  );
};
