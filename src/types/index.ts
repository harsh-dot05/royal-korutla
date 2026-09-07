export type CategorySlug = 
  | 'food'
  | 'groceries'
  | 'shopping'
  | 'services'
  | 'hospitals'
  | 'education'
  | 'public-places'
  | 'jobs'
  | 'real-estate'
  | 'businesses'
  | 'offers';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  iconName: string;
  description: string;
  itemCount: number;
  badge?: string;
  colorGradient: string;
}

export interface LocalBusiness {
  id: string;
  name: string;
  categorySlug: CategorySlug;
  subCategory: string;
  rating: number;
  reviewCount: number;
  address: string;
  landmark: string;
  phone: string;
  whatsapp?: string;
  timing: string;
  isVerified: boolean;
  isFeatured: boolean;
  image: string;
  tags: string[];
  priceRange?: string;
}

export interface Offer {
  id: string;
  title: string;
  businessName: string;
  discount: string;
  code?: string;
  expiry: string;
  image: string;
  tag: string;
  categorySlug: CategorySlug;
  location: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  category: 'Hospital' | 'Police' | 'Fire' | 'Ambulance' | 'Municipal';
  phone: string;
  address: string;
  available24x7: boolean;
}

export interface QuickFilter {
  id: string;
  label: string;
  iconName: string;
  categorySlug?: CategorySlug;
}

export interface LocalStat {
  id: string;
  label: string;
  value: string;
  description: string;
  iconName: string;
}
