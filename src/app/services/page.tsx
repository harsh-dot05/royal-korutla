'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SERVICE_PROVIDERS } from '@/data/mockData';
import { ServiceProvider, ReelPurpose } from '@/types';
import {
  Wrench,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Search,
  CheckCircle2,
  X,
  Send,
  Video,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  getRoyalKorutlaWhatsAppUrl,
  WHATSAPP_PREFILLED_MESSAGES,
  ROYAL_KORUTLA_PHONE_DISPLAY,
} from '@/config/contact';

const CATEGORIES = [
  'All',
  'Electrician',
  'Plumber',
  'Appliance Repair',
  'Carpenter',
  'Cleaning',
  'Computer Services',
  'Driver',
  'Painting',
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [requestModalProvider, setRequestModalProvider] = useState<ServiceProvider | null>(null);

  // Service Request Modal State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState('');
  const [address, setAddress] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Instant Reel Modal State
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [reelBusinessName, setReelBusinessName] = useState('');
  const [reelPhone, setReelPhone] = useState('');
  const [reelCategory, setReelCategory] = useState('Home Services & Repair');
  const [reelPurpose, setReelPurpose] = useState<ReelPurpose>('shop_introduction');
  const [reelLanguage, setReelLanguage] = useState<'Telugu' | 'English'>('Telugu');
  const [reelNotes, setReelNotes] = useState('');
  const [reelSubmitting, setReelSubmitting] = useState(false);
  const [reelSuccess, setReelSuccess] = useState(false);

  const filteredProviders = SERVICE_PROVIDERS.filter((provider) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      provider.serviceCategory === selectedCategory ||
      (selectedCategory === 'Appliance Repair' &&
        (provider.serviceCategory === 'Appliance Repair' ||
          provider.serviceCategory === 'AC Repair'));

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      provider.name.toLowerCase().includes(query) ||
      provider.serviceCategory.toLowerCase().includes(query) ||
      (provider.subCategory && provider.subCategory.toLowerCase().includes(query)) ||
      provider.area.toLowerCase().includes(query) ||
      provider.servicesOffered.some((srv) => srv.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    setIsSubmitting(true);

    try {
      if (requestModalProvider) {
        await fetch('/api/business/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId: requestModalProvider.id,
            businessName: requestModalProvider.name,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            subject: `Service Request: ${serviceNeeded || requestModalProvider.serviceCategory}`,
            message: `Service Required: ${serviceNeeded || requestModalProvider.serviceCategory}. Address: ${address || 'Not specified'}. Preferred Time: ${preferredTime || 'Anytime'}. Notes: ${message || 'None'}`,
          }),
        });
      }
    } catch {
      // Graceful fallback to WhatsApp dispatch
    }

    if (requestModalProvider?.whatsapp || requestModalProvider?.phone) {
      const targetPhone = (requestModalProvider.whatsapp || requestModalProvider.phone).replace(
        /[^0-9]/g,
        ''
      );
      let waMsg = `*SERVICE ENQUIRY - ROYAL KORUTLA*\n`;
      waMsg += `Provider: ${requestModalProvider.name}\n\n`;
      waMsg += `*Customer Details:*\n`;
      waMsg += `Name: ${customerName.trim()}\n`;
      waMsg += `Phone: ${customerPhone.trim()}\n`;
      waMsg += `Service Required: ${serviceNeeded || requestModalProvider.serviceCategory}\n`;
      if (address) waMsg += `Address/Area: ${address.trim()}\n`;
      if (preferredTime) waMsg += `Preferred Time: ${preferredTime.trim()}\n`;
      if (message) waMsg += `Notes: ${message.trim()}\n`;

      window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(waMsg)}`, '_blank');
    }

    setIsSubmitting(false);
    setRequestSent(true);

    setTimeout(() => {
      setRequestSent(false);
      setRequestModalProvider(null);
      setCustomerName('');
      setCustomerPhone('');
      setAddress('');
      setPreferredTime('');
      setMessage('');
    }, 2200);
  };

  const handleReelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelBusinessName.trim() || !reelPhone.trim()) return;

    setReelSubmitting(true);

    try {
      await fetch('/api/reel-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: reelBusinessName.trim(),
          contactPhone: reelPhone.trim(),
          businessCategory: reelCategory,
          reelPurpose,
          preferredLanguage: reelLanguage,
          additionalRequirements: reelNotes.trim(),
        }),
      });
    } catch {
      // Continue to WhatsApp confirmation
    }

    const waMsg =
      `*INSTANT REEL BOOKING - ROYAL KORUTLA*\n\n` +
      `Business: ${reelBusinessName.trim()}\n` +
      `Phone: ${reelPhone.trim()}\n` +
      `Category: ${reelCategory}\n` +
      `Purpose: ${reelPurpose}\n` +
      `Language: ${reelLanguage}\n` +
      (reelNotes ? `Notes: ${reelNotes.trim()}\n` : '');

    window.open(getRoyalKorutlaWhatsAppUrl(waMsg), '_blank');

    setReelSubmitting(false);
    setReelSuccess(true);

    setTimeout(() => {
      setReelSuccess(false);
      setIsReelModalOpen(false);
      setReelBusinessName('');
      setReelPhone('');
      setReelNotes('');
    }, 2200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Banner */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[#E8E5DF] bg-white shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold">
                <Wrench className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Korutla Local Services &amp; Repair</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Verified Technicians &amp; Services in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] max-w-2xl leading-relaxed">
                Direct doorstep booking for electricians, plumbers, appliance technicians, deep cleaning,
                carpenters, drivers, and painters across all 33 wards of Korutla town.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] text-center">
                <span className="text-[11px] font-bold text-[#647067] uppercase tracking-wider block">
                  Town Support
                </span>
                <span className="text-sm font-extrabold text-[#26352D] block mt-0.5">
                  {ROYAL_KORUTLA_PHONE_DISPLAY}
                </span>
              </div>

              <a
                href={getRoyalKorutlaWhatsAppUrl(WHATSAPP_PREFILLED_MESSAGES.serviceOnboarding)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-[#26352D] hover:bg-[#1E2B24] text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-2"
              >
                <span>Register as Service Provider</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* HIGHLIGHTED SERVICE: Royal Korutla Instant Reel */}
        <section
          aria-label="Instant Reel Service"
          className="rounded-2xl border-2 border-[#E66A32]/30 bg-white p-6 sm:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold">
                  <Video className="w-3.5 h-3.5 text-[#E66A32]" />
                  <span>Featured Business Media Service</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#26352D] text-white text-[10px] font-bold">
                  Official Royal Korutla Service
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#26352D] tracking-tight">
                  Instant Reel Video Production for Korutla Businesses &amp; Services
                </h2>
                <p className="text-xs sm:text-sm text-[#647067] mt-1.5 leading-relaxed">
                  Attract customers with professionally shot and edited 30–60 second high-definition video reels.
                  Filmed on-site at your Korutla shop, showroom, restaurant or workshop with Telugu or English voiceover.
                </p>
              </div>

              {/* Reel Feature Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF]">
                  <span className="text-[10px] font-bold text-[#647067] uppercase block">Turnaround</span>
                  <span className="text-xs font-extrabold text-[#26352D] mt-0.5 block">24–48 Hours</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF]">
                  <span className="text-[10px] font-bold text-[#647067] uppercase block">Location</span>
                  <span className="text-xs font-extrabold text-[#26352D] mt-0.5 block">On-Site Filming</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF]">
                  <span className="text-[10px] font-bold text-[#647067] uppercase block">Language</span>
                  <span className="text-xs font-extrabold text-[#26352D] mt-0.5 block">Telugu / English</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF]">
                  <span className="text-[10px] font-bold text-[#647067] uppercase block">Distribution</span>
                  <span className="text-xs font-extrabold text-[#E66A32] mt-0.5 block">Town Showcase</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setIsReelModalOpen(true)}
                className="w-full py-3.5 px-5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Video className="w-4 h-4" />
                <span>Book Instant Reel Now</span>
              </button>

              <a
                href={getRoyalKorutlaWhatsAppUrl(WHATSAPP_PREFILLED_MESSAGES.instantReel)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire via WhatsApp</span>
              </a>

              <p className="text-[11px] text-center text-[#647067]">
                Ideal for retail shops, clinic openings, seasonal discounts &amp; contractor portfolios.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Category Filter Navigation */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#647067]" />
              <input
                type="text"
                placeholder="Search electrician, plumber, AC repair, deep cleaning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#26352D] placeholder-[#647067] focus:outline-none shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#647067] hover:text-[#26352D]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="text-xs text-[#647067] font-semibold text-right sm:text-left">
              Showing <span className="font-bold text-[#26352D]">{filteredProviders.length}</span> verified service listings
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#E66A32] text-white shadow-xs'
                    : 'bg-white text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Service Provider Cards Grid */}
        {filteredProviders.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-[#E8E5DF] p-8 space-y-4">
            <Info className="w-8 h-8 text-[#647067] mx-auto" />
            <h3 className="text-base font-bold text-[#26352D]">No service providers found</h3>
            <p className="text-xs text-[#647067] max-w-md mx-auto">
              We couldn&apos;t find matching service providers for &ldquo;{searchQuery || selectedCategory}&rdquo;.
              Try resetting your search filters or contact Royal Korutla Desk directly.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="rounded-2xl p-5 sm:p-6 border border-[#E8E5DF] hover:border-[#E66A32]/60 bg-white shadow-xs flex flex-col justify-between transition-colors"
              >
                <div>
                  {/* Card Header with Image & Overview */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E8E5DF]">
                      <Image
                        src={provider.image}
                        alt={provider.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#E66A32] uppercase tracking-wider truncate">
                          {provider.serviceCategory}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#26352D] shrink-0">
                          <Star className="w-3.5 h-3.5 fill-[#E66A32] text-[#E66A32]" />
                          <span>{provider.rating}</span>
                          <span className="text-[#647067] text-[10px] font-normal">
                            ({provider.reviewCount})
                          </span>
                        </div>
                      </div>

                      <Link href={`/services/${provider.id}`}>
                        <h3 className="text-sm sm:text-base font-bold text-[#26352D] hover:text-[#E66A32] transition-colors line-clamp-1">
                          {provider.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-[#647067] flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                        <span>{provider.area}</span>
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {provider.isVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#26352D] text-white text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                        {provider.startingPrice && (
                          <span className="text-xs font-extrabold text-[#26352D]">
                            {provider.startingPrice}
                          </span>
                        )}
                        {provider.experienceYears && (
                          <span className="text-[11px] text-[#647067]">
                            • {provider.experienceYears}y exp
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-[#647067] line-clamp-2 leading-relaxed mb-3">
                    {provider.description}
                  </p>

                  {/* Services Checklist */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1.5 text-xs mb-4">
                    <span className="text-[10px] font-bold text-[#647067] uppercase tracking-wider block">
                      Services Covered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {provider.servicesOffered.map((srv, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white text-[10px] font-semibold text-[#26352D] border border-[#E8E5DF]"
                        >
                          ✓ {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Functional Action Buttons */}
                <div className="pt-2 border-t border-[#E8E5DF]/60 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                    <a
                      href={`tel:${provider.phone}`}
                      className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] transition-colors border border-[#E8E5DF]"
                      title={`Call ${provider.name}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                      <span>Call</span>
                    </a>

                    {provider.whatsapp ? (
                      <a
                        href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${provider.name}, I need service in Korutla.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors"
                        title={`WhatsApp ${provider.name}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    ) : (
                      <a
                        href={getRoyalKorutlaWhatsAppUrl(`Hi, I need assistance connecting with ${provider.name} in Korutla.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Desk</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setRequestModalProvider(provider);
                        setServiceNeeded(provider.serviceCategory);
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white transition-colors shadow-2xs"
                    >
                      <span>Enquire</span>
                    </button>
                  </div>

                  <div className="text-center">
                    <Link
                      href={`/services/${provider.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#647067] hover:text-[#E66A32] transition-colors"
                    >
                      <span>View full profile &amp; timing</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Service Request & Enquiry Modal */}
      {requestModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#26352D]/60 p-4">
          <div className="relative w-full max-w-md bg-white border border-[#E8E5DF] rounded-2xl p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setRequestModalProvider(null)}
              className="absolute top-4 right-4 text-[#647067] hover:text-[#26352D] p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-[#E66A32] uppercase tracking-wider block">
                Direct Service Booking
              </span>
              <h3 className="text-base font-extrabold text-[#26352D] mt-0.5">
                Enquire with {requestModalProvider.name}
              </h3>
              <p className="text-xs text-[#647067] mt-0.5">
                Technician operates in: {requestModalProvider.area}
              </p>
            </div>

            {requestSent ? (
              <div className="p-6 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#25D366] mx-auto" />
                <h4 className="text-sm font-bold text-[#26352D]">Enquiry Submitted!</h4>
                <p className="text-xs text-[#647067]">
                  Opening WhatsApp to finalize your booking directly with {requestModalProvider.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3 py-2 text-[#26352D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Your Contact Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 98480 12345"
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3 py-2 text-[#26352D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Service Needed</label>
                  <select
                    value={serviceNeeded}
                    onChange={(e) => setServiceNeeded(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3 py-2 text-[#26352D] focus:outline-none"
                  >
                    <option value={requestModalProvider.serviceCategory}>
                      {requestModalProvider.serviceCategory} (General)
                    </option>
                    {requestModalProvider.servicesOffered.map((srv, idx) => (
                      <option key={idx} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#26352D] font-bold mb-1">
                    Your Address / Korutla Ward
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Ward 14, Near Venkateshwara Temple"
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3 py-2 text-[#26352D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Preferred Time</label>
                  <input
                    type="text"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    placeholder="e.g. Today 4:00 PM / Tomorrow Morning"
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3 py-2 text-[#26352D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Specific Issue / Notes</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe problem (e.g. AC cooling low, tap leaking)..."
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3 py-2 text-[#26352D] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestModalProvider(null)}
                    className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#647067] hover:text-[#26352D] font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Send Enquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Instant Reel Booking Modal */}
      {isReelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#26352D]/60 p-4">
          <div className="relative w-full max-w-lg bg-white border border-[#E8E5DF] rounded-2xl p-6 sm:p-7 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsReelModalOpen(false)}
              className="absolute top-4 right-4 text-[#647067] hover:text-[#26352D] p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold mb-1">
                <Video className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Royal Korutla Official Service</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#26352D]">
                Book an Instant Reel for Your Business
              </h3>
              <p className="text-xs text-[#647067] mt-0.5">
                Our local media team will visit your location in Korutla to shoot and edit a high-converting promotional video.
              </p>
            </div>

            {reelSuccess ? (
              <div className="p-6 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#25D366] mx-auto" />
                <h4 className="text-sm font-bold text-[#26352D]">Reel Request Received!</h4>
                <p className="text-xs text-[#647067]">
                  Opening WhatsApp to confirm your shoot schedule with Royal Korutla media desk.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReelSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">
                    Business / Shop / Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reelBusinessName}
                    onChange={(e) => setReelBusinessName(e.target.value)}
                    placeholder="e.g. Royal Sweets / Sri Balaji Electrician"
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#26352D] font-bold mb-1">
                    Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={reelPhone}
                    onChange={(e) => setReelPhone(e.target.value)}
                    placeholder="e.g. 98480 12345"
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">Reel Purpose</label>
                    <select
                      value={reelPurpose}
                      onChange={(e) => setReelPurpose(e.target.value as ReelPurpose)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3 py-2.5 text-[#26352D] focus:outline-none"
                    >
                      <option value="shop_introduction">Shop / Business Introduction</option>
                      <option value="product_promotion">Product / Service Highlight</option>
                      <option value="offer">Festive / Discount Offer</option>
                      <option value="event">Opening / Event Announcement</option>
                      <option value="other">Custom Requirement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">Preferred Language</label>
                    <select
                      value={reelLanguage}
                      onChange={(e) => setReelLanguage(e.target.value as 'Telugu' | 'English')}
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3 py-2.5 text-[#26352D] focus:outline-none"
                    >
                      <option value="Telugu">Telugu (Recommended for Korutla)</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#26352D] font-bold mb-1">
                    Special Requirements or Notes
                  </label>
                  <textarea
                    rows={2}
                    value={reelNotes}
                    onChange={(e) => setReelNotes(e.target.value)}
                    placeholder="Mention specific items to film, landmark in Korutla, or timeline..."
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2 text-[#26352D] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReelModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] text-[#647067] hover:text-[#26352D] font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reelSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <Video className="w-4 h-4" />
                    <span>{reelSubmitting ? 'Booking...' : 'Confirm Reel Booking'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
