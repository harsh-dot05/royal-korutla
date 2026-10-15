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
    <div className="py-6 space-y-10">
      {/* 1. Featured Local Businesses Section */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Promoted &amp; Verified"
          title="Featured Businesses"
          subtitle="Promoted local businesses in Korutla with verified details. Paid placements are clearly labeled."
          actionText="View All Businesses"
          actionHref="/businesses"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_BUSINESSES.map((biz) => (
            <div
              key={biz.id}
              className="rounded-xl overflow-hidden flex flex-col justify-between border border-[#E8E5DF] bg-white shadow-xs hover:border-[#E66A32] transition-colors"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-[#FAF7F2] border-b border-[#E8E5DF]">
                  <Image
                    src={biz.image}
                    alt={biz.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white border border-[#E8E5DF] text-xs font-bold text-[#26352D] flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-[#E66A32] text-[#E66A32]" />
                    <span>{biz.rating}</span>
                    <span className="text-[#647067] text-[10px]">({biz.reviewCount})</span>
                  </div>

                  {/* Top Left Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {biz.promotionLabel && (
                      <div className="px-2 py-0.5 rounded-md bg-[#E66A32] text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
                        {biz.promotionLabel === 'Featured' ? 'Featured' : 'Sponsored'}
                      </div>
                    )}

                    {biz.isVerified && (
                      <div className="px-2 py-0.5 rounded-md bg-[#26352D] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4">
                  <span className="text-[11px] font-bold text-[#E66A32] uppercase tracking-wider block mb-1">
                    {biz.subCategory}
                  </span>
                  <Link href={`/businesses/${biz.id}`}>
                    <h3 className="text-sm sm:text-base font-bold text-[#26352D] line-clamp-1 hover:text-[#E66A32] transition-colors">
                      {biz.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#647067] mt-1.5 flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8A968D] shrink-0" />
                    <span>{biz.address}</span>
                  </p>

                  <p className="text-xs text-[#647067] mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8A968D] shrink-0" />
                    <span className="text-[#26352D] font-medium">{biz.timing}</span>
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {biz.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#FFF6F0] text-[10px] font-semibold text-[#E66A32] border border-[#F8CFBE]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Call & WhatsApp buttons */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${biz.phone}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE7] text-xs font-bold text-[#26352D] border border-[#E8E5DF] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#26352D]" />
                  <span>Call</span>
                </a>
                {biz.whatsapp ? (
                  <a
                    href={`https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-xs font-bold text-white transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <Link
                    href={`/businesses/${biz.id}`}
                    className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#E66A32] hover:bg-[#D45B25] text-xs font-bold text-white transition-colors"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURED_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="rounded-xl p-5 border border-[#E8E5DF] relative bg-white shadow-xs flex flex-col justify-between hover:border-[#E66A32] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#E66A32] text-white text-xs font-bold shadow-xs">
                    {offer.discount}
                  </span>
                  <span className="text-[11px] font-semibold text-[#647067]">{offer.expiry}</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#26352D] leading-snug">
                  {offer.title}
                </h3>
                <p className="text-xs text-[#26352D] font-bold mt-1.5">
                  At: <span className="text-[#E66A32]">{offer.businessName}</span> ({offer.location})
                </p>
              </div>

              {/* Offer Coupon Box */}
              <div className="mt-4 pt-3 border-t border-[#E8E5DF] flex items-center justify-between">
                {offer.code ? (
                  <div className="flex items-center justify-between w-full p-2 bg-[#FAF7F2] rounded-lg border border-[#E8E5DF]">
                    <span className="font-mono text-xs font-bold text-[#26352D] tracking-wider">
                      {offer.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(offer.code!)}
                      className="p-1 text-xs font-bold text-[#E66A32] hover:text-[#D45B25] flex items-center gap-1 focus:outline-none"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="text-[#10B981] text-[10px]">Copied</span>
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
                  <span className="text-xs text-[#647067] italic">No code required - Show offer at store</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Emergency Contacts Section */}
      <section id="emergency" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl p-5 sm:p-7 border border-[#E8E5DF] bg-white shadow-xs">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-lg bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#26352D]">
                24/7 Emergency Numbers in Korutla
              </h2>
              <p className="text-xs text-[#647067] mt-0.5">
                Verified helpline contacts for police, hospital, fire station, and municipal emergency services.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E8E5DF] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF1F2] text-[#BE123C] font-bold text-[10px] border border-[#FECDD3]">
                      {contact.category}
                    </span>
                    {contact.available24x7 && (
                      <span className="text-[10px] font-bold text-[#26352D] bg-white px-1.5 py-0.5 rounded border border-[#E8E5DF]">24x7</span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#26352D] mt-2">{contact.name}</h4>
                  <p className="text-[11px] text-[#647067] mt-0.5">{contact.address}</p>
                </div>

                <a
                  href={`tel:${contact.phone}`}
                  className="mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#BE123C] hover:bg-[#9F1239] text-white text-xs font-bold transition-colors"
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
