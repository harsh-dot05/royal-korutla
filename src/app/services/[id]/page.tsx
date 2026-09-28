'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SERVICE_PROVIDERS } from '@/data/mockData';
import { Star, MapPin, Phone, MessageSquare, Clock, CheckCircle2, ArrowLeft, X } from 'lucide-react';

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
      let msg = `*SERVICE REQUEST - ROYAL KORUTLA*\n`;
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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
          <Link href="/services" className="hover:text-slate-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> All Services
          </Link>
          <span>/</span>
          <span className="text-blue-700 font-bold">{provider.name}</span>
        </div>

        {/* Profile Card Header */}
        <div className="rounded-xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
              <Image src={provider.image} alt={provider.name} fill sizes="128px" className="object-cover" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  {provider.serviceCategory}
                </span>
                {provider.isVerified && (
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold">
                    Verified Provider ✓
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{provider.name}</h1>

              <p className="text-xs text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-700" /> {provider.area}
              </p>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-900 pt-1">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-blue-700 fill-blue-700" /> {provider.rating} ({provider.reviewCount} reviews)</span>
                {provider.experienceYears && <span className="text-slate-500">• {provider.experienceYears} Years Exp</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${provider.phone}`}
              className="flex-1 md:flex-initial px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-slate-200"
            >
              <Phone className="w-4 h-4 text-blue-700" />
              <span>Call</span>
            </a>

            {provider.whatsapp && (
              <a
                href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${provider.name}, I need service in Korutla.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial px-5 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-initial px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>Request Service</span>
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl p-6 border border-slate-200 bg-white shadow-xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900">About Service Provider</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {provider.description}
              </p>
            </div>

            <div className="rounded-xl p-6 border border-slate-200 bg-white shadow-xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Services Offered Checklist</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {provider.servicesOffered.map((service, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl p-6 border border-slate-200 bg-white shadow-xs space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">Service Details</h3>

              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500 font-medium">Starting Price:</span>
                <span className="text-blue-700 font-bold">{provider.startingPrice || '₹200'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500 font-medium">Timings:</span>
                <span className="text-slate-900 font-bold">{provider.timing}</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500 font-medium">Service Coverage:</span>
                <span className="text-slate-900 font-bold">Korutla Town &amp; 10km radius</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Request Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>

            {requestSent ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-blue-700 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Request Sent!</h3>
                <p className="text-xs text-slate-600">Technician will reach out shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-900">Book {provider.name}</h3>
                <form onSubmit={handleFormSubmit} className="mt-4 space-y-3 text-xs">
                  <input type="text" required placeholder="Your Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-700 font-medium" />
                  <input type="tel" required placeholder="Phone Number *" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-700 font-medium" />
                  <input type="text" placeholder="Service Needed" value={serviceNeeded} onChange={(e) => setServiceNeeded(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-700 font-medium" />
                  <textarea required placeholder="Address in Korutla *" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-700 font-medium" />
                  <button type="submit" className="w-full py-3 rounded-lg bg-blue-700 hover:bg-blue-800 font-bold text-white text-xs transition-colors shadow-xs">Submit &amp; Open WhatsApp</button>
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
