'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

import { getRoyalKorutlaWhatsAppUrl, WHATSAPP_PREFILLED_MESSAGES } from '@/config/contact';

export const FloatingWhatsApp: React.FC = () => {
  const pathname = usePathname();

  // Hide on Admin Panel pages to maintain clean owner view
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const whatsappUrl = getRoyalKorutlaWhatsAppUrl(WHATSAPP_PREFILLED_MESSAGES.defaultSupport);

  return (
    <aside aria-label="Floating WhatsApp Contact">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Royal Korutla on WhatsApp"
        className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm shadow-md border border-[#20BA5A] transition-colors"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        <span className="hidden sm:inline-block tracking-wide">
          WhatsApp Support
        </span>
      </a>
    </aside>
  );
};
