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
import { Badge } from '../common/Badge';
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
  Sparkles,
} from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="py-10 space-y-16">
      {/* 1. Featured Local Businesses */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Promoted & Verified"
          title="Featured Businesses ⭐"
          subtitle="Top recommended places in Korutla backed by local reviews and community trust. Clearly labelled paid promotional placements."
          actionText="View All Businesses"
          actionHref="/businesses"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_BUSINESSES.map((biz) => (
            <div
              key={biz.id}
              className="pastel-card pastel-card-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 group"
            >
              <div>
                {/* Image & Badge Overlay */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={biz.image}
                    alt={biz.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{biz.rating}</span>
                    <span className="text-slate-500 text-[10px]">({biz.reviewCount})</span>
                  </div>

                  {/* Top Left Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {biz.promotionLabel && (
                      <div className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 fill-slate-950" />
                        <span>{biz.promotionLabel}</span>
                      </div>
                    )}

                    {biz.isVerified && (
                      <div className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                    {biz.subCategory}
                  </span>
                  <Link href={`/businesses/${biz.id}`}>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-purple-700 transition-colors">
                      {biz.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{biz.address}</span>
                  </p>

                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-emerald-700 font-semibold">{biz.timing}</span>
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {biz.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-purple-50 text-[10px] font-medium text-purple-800 border border-purple-100"
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
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-800 border border-purple-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-700" />
                  <span>Call</span>
                </a>
                {biz.whatsapp ? (
                  <a
                    href={`https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-200 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <Link
                    href={`/businesses/${biz.id}`}
                    className="flex items-center justify-center px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-xs font-bold text-white transition-colors"
                  >
                    Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Hot Local Offers */}
      <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Exclusive Savings"
          title="Korutla Deals &amp; Store Offers"
          subtitle="Special discounts, festival vouchers and coupons offered by local shopkeepers."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="pastel-card rounded-2xl p-5 border border-amber-200 relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-amber-50/40 via-white to-white"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                    {offer.discount}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{offer.expiry}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {offer.title}
                </h3>
                <p className="text-xs text-amber-800 font-bold mt-1">
                  At: {offer.businessName} ({offer.location})
                </p>
              </div>

              {/* Offer Coupon Box */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                {offer.code ? (
                  <div className="flex items-center justify-between w-full p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                      {offer.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(offer.code!)}
                      className="p-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 text-[10px]">Copied</span>
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
                  <span className="text-xs text-slate-500 italic">No code needed - Show offer at store</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 24/7 Emergency Contacts Section */}
      <section id="emergency" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pastel-card rounded-3xl p-6 sm:p-8 border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-white shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-rose-100 text-rose-700 border border-rose-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                24/7 Emergency Numbers in Korutla
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Direct helpline numbers for hospitals, police, fire station, and municipal services.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold text-[10px]">
                      {contact.category}
                    </span>
                    {contact.available24x7 && (
                      <span className="text-[10px] font-bold text-emerald-700">24x7</span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{contact.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{contact.address}</p>
                </div>

                <a
                  href={`tel:${contact.phone}`}
                  className="mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
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
