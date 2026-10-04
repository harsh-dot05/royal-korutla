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
    <aside aria-label="Floating WhatsApp Contact">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Royal Korutla on WhatsApp"
        className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md border border-blue-500 transition-colors"
      >
        <MessageCircle className="w-5 h-5 fill-white text-blue-600" />
        <span className="hidden sm:inline-block tracking-wide">
          WhatsApp Support
        </span>
      </a>
    </aside>
  );
};
