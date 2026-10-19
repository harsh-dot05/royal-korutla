/**
 * Royal Korutla Official Contact & WhatsApp Configuration
 * 
 * Centralized source of truth for Royal Korutla official support,
 * customer assistance, instant reels, website creation, and business promotions.
 */

const envWhatsApp = process.env.NEXT_PUBLIC_ROYAL_KORUTLA_WHATSAPP;
const sanitizedEnv = envWhatsApp ? envWhatsApp.replace(/[^0-9]/g, '') : '';

// Official Royal Korutla WhatsApp number in 12-digit international format
export const ROYAL_KORUTLA_WHATSAPP_NUMBER = sanitizedEnv || '919963261741';

// Formatted display number for UI
export const ROYAL_KORUTLA_PHONE_DISPLAY = '+91 9963261741';

// Town address details
export const ROYAL_KORUTLA_ADDRESS = 'Korutla, Jagtial District, Telangana - 505326';
export const ROYAL_KORUTLA_SUPPORT_HOURS = '8:00 AM – 10:00 PM (Monday – Sunday)';
export const ROYAL_KORUTLA_OFFICIAL_EMAIL = 'support@royalkorutla.com';

// Standard prefilled messages for different Royal Korutla enquiry types
export const WHATSAPP_PREFILLED_MESSAGES = {
  defaultSupport:
    'Hi Royal Korutla! I am looking for local shops, food, services or information in Korutla.',
  footerSupport:
    'Hi Royal Korutla! I have an inquiry about local shops, services, or platform information in Korutla.',
  instantReel:
    'Hi Royal Korutla! I would like to inquire about creating an Instant Reel for my business in Korutla.',
  websiteCreation:
    'Hi Royal Korutla! I am interested in creating a business website for my shop in Korutla.',
  promotionsAdvertising:
    'Hi Royal Korutla! I would like to inquire about advertising and promoting my business on Royal Korutla.',
  serviceOnboarding:
    'Hi Royal Korutla! I would like to register my business / service on the Royal Korutla directory.',
  orderFallback:
    'Hi Royal Korutla! I need assistance with placing a local order in Korutla.',
  customerHelp:
    'Hi Royal Korutla! I need help with my account, orders, or local services in Korutla.',
} as const;

/**
 * Builds a standard WhatsApp click-to-chat URL with the official Royal Korutla number.
 * 
 * Target format: https://wa.me/919963261741?text=<url_encoded_message>
 */
export function getRoyalKorutlaWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${ROYAL_KORUTLA_WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
