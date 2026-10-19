'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Crown,
  MapPin,
  Search,
  Menu,
  X,
  User,
  ShoppingBag,
  Utensils,
  Store,
  Shirt,
  Wrench,
  HeartPulse,
  Briefcase,
  Home,
  Camera,
  Tag,
  Award,
  AlertCircle,
  Users,
  MessageCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MobileNav } from './MobileNav';
import {
  getRoyalKorutlaWhatsAppUrl,
  WHATSAPP_PREFILLED_MESSAGES,
  ROYAL_KORUTLA_PHONE_DISPLAY,
} from '@/config/contact';

export const Header: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Korutla Town (Wards 1-33)');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}#search-results`);
    }
  };

  const LOCATIONS = [
    'Korutla Town (Wards 1-33)',
    'Metpally Mandal / Town',
    'Ibrahimpatnam Village',
    'Medipally Village',
    'Kathalapur Village',
    'Raikal Village',
    'Vemulawada / Jagtial Road',
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[#E8E5DF] shadow-xs">
        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Royal Korutla Home">
              <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#E66A32] text-white shadow-xs">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-[#26352D]">
                    Royal <span className="text-[#E66A32]">Korutla</span>
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#647067] font-medium tracking-tight mt-0.5">
                  Everything in Korutla
                </div>
              </div>
            </Link>

            {/* Location Selector (Desktop/Tablet) */}
            <div className="relative hidden md:block shrink-0">
              <button
                type="button"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE7] border border-[#E8E5DF] text-xs font-semibold text-[#26352D] transition-colors"
                aria-label="Select location"
              >
                <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                <span className="max-w-[140px] truncate">{selectedLocation}</span>
                <span className="text-[10px] text-[#647067]">▼</span>
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute left-0 mt-1 w-64 bg-white border border-[#E8E5DF] rounded-lg shadow-lg py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#647067] border-b border-[#E8E5DF]">
                    Select Delivery / Browsing Area
                  </div>
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-[#FFF6F0] hover:text-[#E66A32] transition-colors flex items-center justify-between ${
                        selectedLocation === loc ? 'text-[#E66A32] font-bold bg-[#FFF6F0]' : 'text-[#26352D]'
                      }`}
                    >
                      <span>{loc}</span>
                      {selectedLocation === loc && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Prominent Search Bar (Flipkart inspired) */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden sm:block">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search food, groceries, clothing, services, doctors in Korutla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D5D1C8] focus:border-[#E66A32] rounded-lg pl-3.5 pr-20 py-2 sm:py-2.5 text-xs sm:text-sm text-[#26352D] placeholder-[#8A968D] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-1 px-3.5 py-1.5 rounded-md bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Search</span>
                </button>
              </div>
            </form>

            {/* Right Action Links */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Royal Points Badge / Link */}
              <Link
                href="/rewards"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FFF6F0] hover:bg-[#FFEADA] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold transition-colors"
                title="Royal Points Balance and Vouchers"
              >
                <Crown className="w-4 h-4 text-[#E66A32]" />
                <span className="hidden md:inline">Royal Points</span>
              </Link>

              {/* WhatsApp Support Shortcut */}
              <a
                href={getRoyalKorutlaWhatsAppUrl(WHATSAPP_PREFILLED_MESSAGES.defaultSupport)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#EAFBF0] border border-[#E8E5DF] hover:border-[#25D366] text-[#26352D] hover:text-[#1EBE5D] text-xs font-bold transition-colors"
                title={`WhatsApp Support: ${ROYAL_KORUTLA_PHONE_DISPLAY}`}
                aria-label={`Chat with Royal Korutla on WhatsApp ${ROYAL_KORUTLA_PHONE_DISPLAY}`}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span className="hidden xl:inline">WhatsApp</span>
              </a>

              {/* Customer Account / Sign In */}
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE7] border border-[#E8E5DF] text-[#26352D] text-xs font-semibold transition-colors"
                title="Customer Sign In"
              >
                <User className="w-4 h-4 text-[#26352D]" />
                <span className="hidden lg:inline">Sign In</span>
              </Link>

              {/* Cart Shortcut */}
              <Link
                href="/food"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE7] border border-[#E8E5DF] text-[#26352D] text-xs font-semibold transition-colors"
                title="View Food & Orders Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#26352D]" />
                <span className="hidden lg:inline">Cart</span>
              </Link>

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-[#FAF7F2] text-[#26352D] border border-[#E8E5DF] hover:bg-[#F4EFE7] focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Row (visible on small screens) */}
          <div className="pb-3 sm:hidden">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search shops, food, services in Korutla..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D5D1C8] focus:border-[#E66A32] rounded-lg pl-3 pr-14 py-2 text-xs text-[#26352D] placeholder-[#8A968D] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 px-3 py-1 rounded-md bg-[#E66A32] text-white text-xs font-bold"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Flipkart-Style Category Strip (Horizontal desktop bar with responsive scroll) */}
        <nav
          className="border-t border-[#E8E5DF] bg-white overflow-x-auto scrollbar-none"
          aria-label="Category browsing strip"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 sm:gap-2 py-2 text-xs font-semibold whitespace-nowrap">
              <Link
                href="/food"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#26352D] hover:text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0"
              >
                <Utensils className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Food &amp; Dining</span>
              </Link>

              <Link
                href="/groceries"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#26352D] hover:text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0"
              >
                <Store className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Groceries</span>
              </Link>

              <Link
                href="/clothing"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#26352D] hover:text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0"
              >
                <Shirt className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Clothing Stores</span>
              </Link>

              <Link
                href="/shopping"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#26352D] hover:text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Shopping</span>
              </Link>

              <Link
                href="/services"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#26352D] hover:text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0"
              >
                <Wrench className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Local Services</span>
              </Link>

              <Link
                href="/emergency"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#BE123C] hover:bg-[#FFF1F2] transition-colors shrink-0 font-bold"
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#BE123C]" />
                <span>Emergency 24/7</span>
              </Link>

              <Link
                href="/hospitals"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#26352D] hover:text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0"
              >
                <HeartPulse className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Hospitals</span>
              </Link>

              <Link
                href="/jobs"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#26352D] hover:text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Jobs</span>
              </Link>

              <Link
                href="/real-estate"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#26352D] hover:text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0"
              >
                <Home className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Real Estate</span>
              </Link>

              <Link
                href="/photography"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#26352D] hover:text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0"
              >
                <Camera className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Photography</span>
              </Link>

              <Link
                href="/offers"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#26352D] hover:text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0"
              >
                <Tag className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Offers</span>
              </Link>

              <Link
                href="/representatives"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#26352D] hover:text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0"
              >
                <Users className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Representatives</span>
              </Link>

              <Link
                href="/rewards"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#E66A32] hover:bg-[#FFF6F0] transition-colors shrink-0 font-bold"
              >
                <Award className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Royal Points</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};
