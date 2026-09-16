'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SERVICE_PROVIDERS, QUICK_SERVICE_CATEGORIES } from '@/data/mockData';
import { ServiceProvider, ServiceRequest } from '@/types';
import { Wrench, MapPin, Phone, MessageSquare, Star, Clock, Search, CheckCircle2, ShieldCheck, Calendar, X, Send } from 'lucide-react';

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

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);

    if (requestModalProvider?.whatsapp) {
      let waMsg = `*SERVICE REQUEST - ROYAL KORUTLA* 🛠️\n`;
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
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-3xl glass-card p-6 sm:p-8 border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3">
                <Wrench className="w-3.5 h-3.5" />
                <span>Korutla Doorstep Repair &amp; Home Services</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                Local Electricians, Plumbers &amp; Technicians in <span className="gradient-text-royal">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                Book verified home repair experts for AC servicing, house wiring, plumbing leaks, carpenter works, and appliance repair.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-purple-500/30 text-center w-full md:w-auto">
              <span className="text-xs font-bold text-amber-400 block">Instant Technicians</span>
              <span className="text-sm font-bold text-white">Doorstep Service in 30 Mins</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 'Electrician', 'Plumber', 'AC Repair'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Service Provider Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                    <Image src={provider.image} alt={provider.name} fill sizes="96px" className="object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">{provider.serviceCategory}</span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{provider.rating}</span>
                        <span className="text-slate-500 text-[10px]">({provider.reviewCount})</span>
                      </div>
                    </div>

                    <Link href={`/services/${provider.id}`}>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mt-0.5">
                        {provider.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {provider.area}
                    </p>

                    {provider.startingPrice && (
                      <p className="text-xs font-bold text-emerald-400 mt-1">
                        Starts at {provider.startingPrice}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 text-xs mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Services Offered:</span>
                  <div className="flex flex-wrap gap-1">
                    {provider.servicesOffered.slice(0, 3).map((srv, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] text-slate-300 border border-slate-800">
                        ✓ {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 grid grid-cols-3 gap-2">
                <a
                  href={`tel:${provider.phone}`}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Call</span>
                </a>

                {provider.whatsapp ? (
                  <a
                    href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${provider.name}, I need home service in Korutla.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-xs font-bold text-emerald-400 border border-emerald-500/30 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <Link href={`/services/${provider.id}`} className="flex items-center justify-center px-3 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white">
                    Details
                  </Link>
                )}

                <button
                  onClick={() => {
                    setRequestModalProvider(provider);
                    setServiceNeeded(provider.serviceCategory);
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors shadow-md shadow-purple-600/20"
                >
                  <span>Request</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Request Service Modal */}
      {requestModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <button onClick={() => setRequestModalProvider(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            {requestSent ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-white">Service Request Sent!</h3>
                <p className="text-xs text-slate-300">
                  {requestModalProvider.name} technician will contact you shortly to confirm doorstep timing.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white">Request Service from {requestModalProvider.name}</h3>
                <p className="text-xs text-purple-400 font-semibold mt-0.5">{requestModalProvider.serviceCategory} ({requestModalProvider.area})</p>

                <form onSubmit={handleRequestSubmit} className="mt-4 space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Phone Number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Specific Repair Needed (e.g. AC Gas Filling, Pipe Leak)"
                    value={serviceNeeded}
                    onChange={(e) => setServiceNeeded(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                  <textarea
                    required
                    placeholder="Korutla Address / Colony *"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Preferred Timing (e.g. Today 4 PM)"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                  <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs transition-colors flex items-center justify-center gap-1.5">
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
