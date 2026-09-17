'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FEATURED_BUSINESSES,
  FEATURED_OFFERS,
  EMERGENCY_CONTACTS,
} from '../../data/mockData';
import { SectionHeader } from '../common/SectionHeader';
import {
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="py-10 space-y-12">
      {/* 1. Featured Local Businesses Section */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Promoted & Verified"
          title="Featured Businesses"
          subtitle="Promoted local businesses in Korutla with verified details. Paid placements are clearly labeled."
          actionText="View All Businesses"
          actionHref="/businesses"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_BUSINESSES.map((biz) => (
            <div
              key={biz.id}
              className="rounded-xl overflow-hidden flex flex-col justify-between border border-slate-200 bg-white shadow-xs"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                  <Image
                    src={biz.image}
                    alt={biz.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-blue-700 text-blue-700" />
                    <span>{biz.rating}</span>
                    <span className="text-slate-500 text-[10px]">({biz.reviewCount})</span>
                  </div>

                  {/* Top Left Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {biz.promotionLabel && (
                      <div className="px-2.5 py-0.5 rounded-md bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
                        {biz.promotionLabel === 'Featured' ? 'Featured' : 'Sponsored'}
                      </div>
                    )}

                    {biz.isVerified && (
                      <div className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-blue-400" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                    {biz.subCategory}
                  </span>
                  <Link href={`/businesses/${biz.id}`}>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 hover:text-blue-700 transition-colors">
                      {biz.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{biz.address}</span>
                  </p>

                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-700 font-medium">{biz.timing}</span>
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {biz.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-semibold text-blue-800 border border-blue-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Call buttons */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${biz.phone}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 border border-slate-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-700" />
                  <span>Call</span>
                </a>
                {biz.whatsapp ? (
                  <a
                    href={`https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-bold text-white transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <Link
                    href={`/businesses/${biz.id}`}
                    className="flex items-center justify-center px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-bold text-white transition-colors"
                  >
                    Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Hot Local Offers Section */}
      <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Special Discounts"
          title="Deals &amp; Store Offers"
          subtitle="Discounts and savings offered by local shops in Korutla."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="rounded-xl p-5 border border-slate-200 relative bg-white shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-blue-700 text-white text-xs font-bold">
                    {offer.discount}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{offer.expiry}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {offer.title}
                </h3>
                <p className="text-xs text-blue-700 font-bold mt-1">
                  At: {offer.businessName} ({offer.location})
                </p>
              </div>

              {/* Offer Coupon Box */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                {offer.code ? (
                  <div className="flex items-center justify-between w-full p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                      {offer.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(offer.code!)}
                      className="p-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-blue-700" />
                          <span className="text-blue-700 text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">No code required - Show offer at store</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Emergency Contacts Section */}
      <section id="emergency" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                24/7 Emergency Numbers in Korutla
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Helpline contacts for police, hospital, fire station, and municipal emergency services.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">
                      {contact.category}
                    </span>
                    {contact.available24x7 && (
                      <span className="text-[10px] font-bold text-slate-700">24x7</span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{contact.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{contact.address}</p>
                </div>

                <a
                  href={`tel:${contact.phone}`}
                  className="mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {contact.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
