import { HeroBannerSlide } from '@/types';

// Curated high-resolution genuine local-shopping & Korutla-related imagery
export const PRESET_HERO_IMAGES = [
  {
    id: 'img-clothing',
    title: 'Korutla Silk Sarees & Handlooms',
    category: 'Clothing Stores',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'img-groceries',
    title: 'Daily Groceries & Fresh Produce',
    category: 'Groceries & Marts',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'img-food',
    title: 'Authentic Hyderabadi & Local Dining',
    category: 'Food & Dining',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'img-healthcare',
    title: '24/7 Hospital & Clinical Care',
    category: 'Healthcare',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'img-shopping',
    title: 'Local Retail & Footwear Showrooms',
    category: 'Shopping',
    url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'img-services',
    title: 'Home Repair & Electric Services',
    category: 'Services',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&auto=format&fit=crop&q=85',
  },
];

const INITIAL_HERO_BANNERS: HeroBannerSlide[] = [
  {
    id: 'banner-1',
    title: 'Korutla Traditional Handlooms & Saree Market',
    subtitle: 'Discover authentic Pattu sarees, bridal lehengas, and festive menswear from renowned cloth merchants in Korutla.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&auto=format&fit=crop&q=85',
    badgeText: 'CLOTH MARKET',
    badgeColor: 'bg-[#E66A32]',
    ctaText: 'Explore Clothing Stores',
    ctaLink: '/clothing',
    isActive: true,
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'banner-2',
    title: 'Fresh Vegetables, Fruits & Daily Marts',
    subtitle: 'Connect with trusted local grocery marts, fresh produce vendors, and supermarkets across Korutla town.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=85',
    badgeText: 'DAILY ESSENTIALS',
    badgeColor: 'bg-[#E66A32]',
    ctaText: 'View Grocery Stores',
    ctaLink: '/groceries',
    isActive: true,
    order: 2,
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'banner-3',
    title: 'Local Dining & Family Restaurants in Korutla',
    subtitle: 'Explore breakfast tiffins, authentic biryanis, and family dining options across Korutla with quick takeaway and delivery.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1600&auto=format&fit=crop&q=85',
    badgeText: 'TOWN DINING',
    badgeColor: 'bg-[#E66A32]',
    ctaText: 'Order Food Online',
    ctaLink: '/food',
    isActive: true,
    order: 3,
    createdAt: '2026-01-03T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
  },
  {
    id: 'banner-4',
    title: '24/7 Emergency Healthcare & Hospital Directory',
    subtitle: 'Emergency ambulance contacts, specialty doctor appointments, and diagnostic clinics serving Korutla and surrounding mandals.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=85',
    badgeText: '24/7 HEALTHCARE',
    badgeColor: 'bg-[#E66A32]',
    ctaText: 'Find Doctors & Hospitals',
    ctaLink: '/hospitals',
    isActive: true,
    order: 4,
    createdAt: '2026-01-04T00:00:00.000Z',
    updatedAt: '2026-01-04T00:00:00.000Z',
  },
];

let heroBannersStore: HeroBannerSlide[] = JSON.parse(JSON.stringify(INITIAL_HERO_BANNERS));

/**
 * Returns all hero banners (active and inactive) sorted by display order
 */
export function getAllBanners(): HeroBannerSlide[] {
  return [...heroBannersStore].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Returns only active hero banners for public homepage display
 */
export function getActiveBanners(): HeroBannerSlide[] {
  return getAllBanners().filter((b) => b.isActive !== false);
}

/**
 * Get banner by id
 */
export function getBannerById(id: string): HeroBannerSlide | null {
  return heroBannersStore.find((b) => b.id === id) || null;
}

/**
 * Add a new hero banner
 */
export function addBanner(
  data: Omit<HeroBannerSlide, 'id' | 'createdAt' | 'updatedAt' | 'order'> & {
    id?: string;
    order?: number;
  }
): HeroBannerSlide {
  const newId = data.id || `banner-${Date.now()}`;
  const maxOrder = heroBannersStore.reduce((max, b) => Math.max(max, b.order ?? 0), 0);
  const now = new Date().toISOString();

  const newBanner: HeroBannerSlide = {
    ...data,
    id: newId,
    order: data.order ?? maxOrder + 1,
    isActive: data.isActive !== false,
    badgeColor: data.badgeColor || 'bg-[#E66A32]',
    createdAt: now,
    updatedAt: now,
  };

  heroBannersStore.push(newBanner);
  return newBanner;
}

/**
 * Update an existing hero banner
 */
export function updateBanner(
  id: string,
  updates: Partial<Omit<HeroBannerSlide, 'id' | 'createdAt'>>
): HeroBannerSlide | null {
  const index = heroBannersStore.findIndex((b) => b.id === id);
  if (index === -1) return null;

  heroBannersStore[index] = {
    ...heroBannersStore[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return heroBannersStore[index];
}

/**
 * Toggle active state of a banner
 */
export function toggleBannerActive(id: string): HeroBannerSlide | null {
  const index = heroBannersStore.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const current = heroBannersStore[index].isActive !== false;
  heroBannersStore[index].isActive = !current;
  heroBannersStore[index].updatedAt = new Date().toISOString();

  return heroBannersStore[index];
}

/**
 * Delete a hero banner
 */
export function deleteBanner(id: string): boolean {
  const prevLen = heroBannersStore.length;
  heroBannersStore = heroBannersStore.filter((b) => b.id !== id);
  return heroBannersStore.length < prevLen;
}

/**
 * Reorder banners according to an array of banner IDs
 */
export function reorderBanners(orderedIds: string[]): HeroBannerSlide[] {
  orderedIds.forEach((id, idx) => {
    const item = heroBannersStore.find((b) => b.id === id);
    if (item) {
      item.order = idx + 1;
      item.updatedAt = new Date().toISOString();
    }
  });

  return getAllBanners();
}
