'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const pathname = usePathname();

  // Hide on Admin Panel pages to maintain clean owner view
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const whatsappNumber = (process.env.NEXT_PUBLIC_ROYAL_KORUTLA_WHATSAPP || '+919848012345').replace(/[^0-9]/g, '');
  const defaultMsg = encodeURIComponent('Hi Royal Korutla! I am looking for local shops, food, services or information in Korutla.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMsg}`;

  return (
    <aside aria-label="Floating Contact Options">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Royal Korutla on WhatsApp"
        className="fixed bottom-20 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-2xl shadow-emerald-600/40 border-2 border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200"></span>
          </span>
        </div>
        <span className="hidden sm:inline-block font-extrabold tracking-wide">
          Korutla Helpdesk
        </span>
      </a>
    </aside>
  );
};
