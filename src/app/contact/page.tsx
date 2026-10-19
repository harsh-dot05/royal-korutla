import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  MessageCircle,
  Phone,
  Video,
  Globe2,
  Tag,
  HelpCircle,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  ROYAL_KORUTLA_PHONE_DISPLAY,
  ROYAL_KORUTLA_ADDRESS,
  ROYAL_KORUTLA_SUPPORT_HOURS,
  getRoyalKorutlaWhatsAppUrl,
  WHATSAPP_PREFILLED_MESSAGES,
} from '@/config/contact';

export const metadata: Metadata = {
  title: 'Contact Royal Korutla | Official WhatsApp Support & Service Enquiries',
  description:
    'Contact Royal Korutla via official WhatsApp (+91 9963261741) for Instant Reel video production, business website creation, store promotions, and customer support in Korutla town.',
};

export default function ContactPage() {
  const enquiryCategories = [
    {
      id: 'customer-support',
      title: 'Customer Support & Help',
      subtitle: 'Assistance with town directory, orders, points, or local services',
      icon: HelpCircle,
      badge: 'General Help',
      message: WHATSAPP_PREFILLED_MESSAGES.customerHelp,
      buttonText: 'Chat for Support',
      highlightColor: 'border-blue-200 bg-blue-50/50 text-blue-700',
    },
    {
      id: 'instant-reel',
      title: 'Instant Reel Service Enquiries',
      subtitle: 'Book 4K vertical video shoots & Instagram reels for your local business',
      icon: Video,
      badge: 'Video Production',
      message: WHATSAPP_PREFILLED_MESSAGES.instantReel,
      buttonText: 'Enquire for Instant Reel',
      highlightColor: 'border-orange-200 bg-orange-50/50 text-[#E66A32]',
    },
    {
      id: 'website-creation',
      title: 'Business Website Creation',
      subtitle: 'Get an official fast, mobile-friendly website with WhatsApp catalog for your shop',
      icon: Globe2,
      badge: 'Digital Solutions',
      message: WHATSAPP_PREFILLED_MESSAGES.websiteCreation,
      buttonText: 'Enquire for Website Creation',
      highlightColor: 'border-emerald-200 bg-emerald-50/50 text-emerald-700',
    },
    {
      id: 'promotions',
      title: 'Promotions & Banner Advertising',
      subtitle: 'Feature your store discounts, festival offers, and banner ads on Royal Korutla',
      icon: Tag,
      badge: 'Marketing Reach',
      message: WHATSAPP_PREFILLED_MESSAGES.promotionsAdvertising,
      buttonText: 'Enquire for Promotion',
      highlightColor: 'border-purple-200 bg-purple-50/50 text-purple-700',
    },
    {
      id: 'merchant-listing',
      title: 'Business Onboarding & Verification',
      subtitle: 'List your shop, clinic, showroom, or professional service in our verified directory',
      icon: Building2,
      badge: 'Listing & Badges',
      message: WHATSAPP_PREFILLED_MESSAGES.serviceOnboarding,
      buttonText: 'Enquire to List Business',
      highlightColor: 'border-amber-200 bg-amber-50/50 text-amber-700',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="rounded-3xl p-6 sm:p-10 border border-[#E8E5DF] bg-white shadow-md relative overflow-hidden">
          <div className="h-1.5 w-full bg-[#E66A32] absolute top-0 inset-x-0" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-xs font-bold text-[#E66A32]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Support &amp; Enquiries Hub</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight leading-tight">
              Connect with Royal Korutla on <span className="text-[#25D366]">WhatsApp</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#647067] leading-relaxed font-normal">
              Need immediate help, want to book an Instant Reel shoot, get a custom business website created, or promote your store across Korutla town? Our coordinator team is available directly on WhatsApp.
            </p>

            {/* Official Primary Contact Card */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                id="main-contact-whatsapp-btn"
                href={getRoyalKorutlaWhatsAppUrl(WHATSAPP_PREFILLED_MESSAGES.defaultSupport)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-sm shadow-md transition-all transform active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                <span>Chat on WhatsApp: {ROYAL_KORUTLA_PHONE_DISPLAY}</span>
              </a>

              <a
                href={`tel:${ROYAL_KORUTLA_PHONE_DISPLAY.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE7] border border-[#E8E5DF] text-[#26352D] font-bold text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-[#E66A32]" />
                <span>Call {ROYAL_KORUTLA_PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF6F0] flex items-center justify-center text-[#E66A32] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#26352D]">Serving Location</p>
              <p className="text-[11px] text-[#647067]">{ROYAL_KORUTLA_ADDRESS}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAFBF0] flex items-center justify-center text-[#25D366] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#26352D]">Support Availability</p>
              <p className="text-[11px] text-[#647067]">{ROYAL_KORUTLA_SUPPORT_HOURS}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF6F0] flex items-center justify-center text-[#E66A32] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#26352D]">Verified Town Platform</p>
              <p className="text-[11px] text-[#647067]">Direct coordinator response within 24h</p>
            </div>
          </div>
        </div>

        {/* Dedicated Enquiry Categories */}
        <section className="space-y-4" aria-label="Service Enquiry Channels">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#26352D] tracking-tight">
              Select Your Enquiry Type
            </h2>
            <p className="text-xs sm:text-sm text-[#647067]">
              Every button opens WhatsApp with prefilled message details so our team can assist you without delay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enquiryCategories.map((item) => {
              const Icon = item.icon;
              const waUrl = getRoyalKorutlaWhatsAppUrl(item.message);

              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-5 border border-[#E8E5DF] bg-white shadow-xs hover:border-[#E66A32] transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] flex items-center justify-center text-[#E66A32]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.highlightColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#26352D]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#647067] mt-1 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] text-[11px] text-[#647067] italic font-medium">
                      &quot;{item.message}&quot;
                    </div>
                  </div>

                  <div className="pt-4">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                      aria-label={`${item.buttonText} on WhatsApp ${ROYAL_KORUTLA_PHONE_DISPLAY}`}
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                      <span>{item.buttonText}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
