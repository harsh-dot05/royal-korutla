'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SERVICE_PROVIDERS } from '@/data/mockData';
import { Star, MapPin, Phone, MessageSquare, Clock, CheckCircle2, ShieldCheck, ArrowLeft, Send, X } from 'lucide-react';

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const providerId = resolvedParams.id;

  const provider = SERVICE_PROVIDERS.find((p) => p.id === providerId) || SERVICE_PROVIDERS[0];

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState(provider.serviceCategory);
  const [address, setAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);

    if (provider.whatsapp) {
      let msg = `*SERVICE REQUEST - ROYAL KORUTLA* 🛠️\n`;
      msg += `Provider: ${provider.name}\n`;
      msg += `Customer: ${customerName} (${customerPhone})\n`;
      msg += `Service: ${serviceNeeded}\n`;
      msg += `Address: ${address}\n`;

      const targetWhatsapp = provider.whatsapp.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    }

    setTimeout(() => {
      setRequestSent(false);
      setIsModalOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <Link href="/services" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> All Services
          </Link>
          <span>/</span>
          <span className="text-purple-400 font-bold">{provider.name}</span>
        </div>

        {/* Profile Card Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
              <Image src={provider.image} alt={provider.name} fill sizes="128px" className="object-cover" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  {provider.serviceCategory}
                </span>
                {provider.isVerified && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    Verified Provider ✓
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{provider.name}</h1>

              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {provider.area}
              </p>

              <div className="flex items-center gap-3 text-xs font-bold text-amber-400 pt-1">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400" /> {provider.rating} ({provider.reviewCount} reviews)</span>
                {provider.experienceYears && <span className="text-slate-300">• {provider.experienceYears} Years Exp</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${provider.phone}`}
              className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <Phone className="w-4 h-4 text-purple-400" />
              <span>Call</span>
            </a>

            {provider.whatsapp && (
              <a
                href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${provider.name}, I need service in Korutla.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-initial px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/30"
            >
              <span>Request Service</span>
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
              <h2 className="text-lg font-bold text-white">About Service Provider</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {provider.description}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
              <h2 className="text-lg font-bold text-white">Services Offered Checklist</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {provider.servicesOffered.map((service, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Service Details</h3>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Starting Price:</span>
                <span className="text-emerald-400 font-bold">{provider.startingPrice || '₹200'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Timings:</span>
                <span className="text-white font-bold">{provider.timing}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Service Coverage:</span>
                <span className="text-white font-bold">Korutla Town &amp; 10km radius</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Request Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            {requestSent ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-white">Request Sent!</h3>
                <p className="text-xs text-slate-300">Technician will reach out shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white">Book {provider.name}</h3>
                <form onSubmit={handleFormSubmit} className="mt-4 space-y-3 text-xs">
                  <input type="text" required placeholder="Your Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                  <input type="tel" required placeholder="Phone Number *" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                  <input type="text" placeholder="Service Needed" value={serviceNeeded} onChange={(e) => setServiceNeeded(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                  <textarea required placeholder="Address in Korutla *" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                  <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 font-bold text-white text-xs">Submit &amp; Open WhatsApp</button>
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
