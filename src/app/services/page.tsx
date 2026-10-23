'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SERVICE_PROVIDERS } from '@/data/mockData';
import { ServiceProvider } from '@/types';
import { Wrench, MapPin, Phone, MessageCircle, Star, Search, CheckCircle2, X, Send, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [requestModalProvider, setRequestModalProvider] = useState<ServiceProvider | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState('');
  const [address, setAddress] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const categories = ['All', 'Electrician', 'Plumber', 'AC Repair', 'Appliance Repair', 'Carpenter', 'Cleaning', 'Driver', 'Beauty & Salon'];

  const filteredProviders = SERVICE_PROVIDERS.filter((provider) => {
    const matchesCategory = selectedCategory === 'All' || provider.serviceCategory === selectedCategory;
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);

    try {
      if (requestModalProvider) {
        // Also log to backend enquiries
        await fetch('/api/business/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId: requestModalProvider.id,
            businessName: requestModalProvider.name,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            serviceOrProduct: serviceNeeded || requestModalProvider.serviceCategory,
            message: `Address: ${address}. Time: ${preferredTime || 'Anytime'}. Notes: ${message}`,
          }),
        });
      }
    } catch {}

    if (requestModalProvider?.whatsapp) {
      let waMsg = `*SERVICE REQUEST - ROYAL KORUTLA*\n`;
      waMsg += `Provider: ${requestModalProvider.name}\n\n`;
      waMsg += `*Customer Details:*\n`;
      waMsg += `Name: ${customerName}\n`;
      waMsg += `Phone: ${customerPhone}\n`;
      waMsg += `Service Required: ${serviceNeeded || requestModalProvider.serviceCategory}\n`;
      waMsg += `Address: ${address}\n`;
      if (preferredTime) waMsg += `Preferred Time: ${preferredTime}\n`;
      if (message) waMsg += `Notes: ${message}\n`;

      const targetWhatsapp = requestModalProvider.whatsapp.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(waMsg)}`, '_blank');
    }

    setTimeout(() => {
      setRequestSent(false);
      setRequestModalProvider(null);
      setCustomerName('');
      setCustomerPhone('');
      setAddress('');
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[#E8E5DF] bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold mb-3">
                <Wrench className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Korutla Services &amp; Repair</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Electricians, Plumbers &amp; Technicians in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] mt-2 max-w-xl leading-relaxed">
                Book verified home repair experts for AC servicing, house wiring, plumbing leaks, carpentry, and appliance maintenance in Korutla town.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F0F4F1] border border-[#26352D]/15 text-center w-full md:w-auto space-y-0.5">
              <span className="text-xs font-bold text-[#26352D] block">Direct Booking</span>
              <span className="text-sm font-extrabold text-[#E66A32]">Doorstep Technicians</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#647067]" />
            <input
              type="text"
              placeholder="Search electrician, plumber, AC repair..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#26352D] placeholder-[#647067] focus:outline-none shadow-xs"
              suppressHydrationWarning
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
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
            <p className="text-sm font-semibold text-[#26352D]">No service providers found for your search.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="rounded-2xl p-5 border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E8E5DF]">
                      <Image src={provider.image} alt={provider.name} fill sizes="96px" className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#E66A32] uppercase tracking-wider">{provider.serviceCategory}</span>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#26352D]">
                          <Star className="w-3.5 h-3.5 fill-[#E66A32] text-[#E66A32]" />
                          <span>{provider.rating}</span>
                          <span className="text-[#647067] text-[10px]">({provider.reviewCount})</span>
                        </div>
                      </div>

                      <Link href={`/services/${provider.id}`}>
                        <h3 className="text-base font-bold text-[#26352D] hover:text-[#E66A32] transition-colors mt-0.5">
                          {provider.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-[#647067] flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#E66A32]" /> {provider.area}
                      </p>

                      {provider.startingPrice && (
                        <p className="text-xs font-bold text-[#26352D] mt-1">
                          Starts at {provider.startingPrice}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1 text-xs mb-4">
                    <span className="text-[10px] font-bold text-[#647067] uppercase tracking-wider block">Services Offered:</span>
                    <div className="flex flex-wrap gap-1">
                      {provider.servicesOffered.slice(0, 3).map((srv, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white text-[10px] font-medium text-[#26352D] border border-[#E8E5DF]">
                          ✓ {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 grid grid-cols-3 gap-2 text-xs font-bold">
                  <a
                    href={`tel:${provider.phone}`}
                    className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] transition-colors border border-[#E8E5DF]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                    <span>Call</span>
                  </a>

                  {provider.whatsapp ? (
                    <a
                      href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${provider.name}, I need home service in Korutla.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  ) : (
                    <Link href={`/services/${provider.id}`} className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-[#FAF7F2] text-[#26352D] border border-[#E8E5DF]">
                      Details
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setRequestModalProvider(provider);
                      setServiceNeeded(provider.serviceCategory);
                    }}
                    className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white transition-colors shadow-2xs"
                  >
                    <span>Request</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Request Service Modal */}
      {requestModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#26352D]/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md bg-white border border-[#E8E5DF] rounded-2xl p-6 shadow-2xl space-y-3">
            <button
              onClick={() => setRequestModalProvider(null)}
              className="absolute top-4 right-4 text-[#647067] hover:text-[#26352D]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {requestSent ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#E66A32] mx-auto" />
                <h3 className="text-lg font-bold text-[#26352D]">Service Request Sent</h3>
                <p className="text-xs text-[#647067]">
                  {requestModalProvider.name} technician in Korutla will contact you directly.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#26352D]">Request Service from {requestModalProvider.name}</h3>
                <p className="text-xs text-[#E66A32] font-semibold">{requestModalProvider.serviceCategory} ({requestModalProvider.area})</p>

                <form onSubmit={handleRequestSubmit} className="mt-4 space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Phone Number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Specific Repair Needed (e.g. AC Gas Filling, Pipe Leak)"
                    value={serviceNeeded}
                    onChange={(e) => setServiceNeeded(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  />
                  <textarea
                    required
                    placeholder="Korutla Address / Colony *"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Preferred Timing (e.g. Today 4 PM)"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] font-bold text-white text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit &amp; Open WhatsApp</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
