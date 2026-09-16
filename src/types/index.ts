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

export type PromotionType = 
  | 'FEATURED_BUSINESS'
  | 'HOMEPAGE_FEATURED'
  | 'CATEGORY_FEATURED'
  | 'SPONSORED_OFFER'
  | 'FESTIVAL_CAMPAIGN'
  | 'BUSINESS_OF_THE_WEEK';

export interface Promotion {
  id: string;
  businessId: string;
  businessName: string;
  promotionType: PromotionType;
  placement: string;
  startDate: string;
  endDate: string;
  priority: number;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  badgeLabel?: string;
  bannerImage?: string;
  title?: string;
  description?: string;
  offerText?: string;
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
  promotionType?: PromotionType;
  promotionLabel?: string;
  image: string;
  galleryImages?: string[];
  description?: string;
  tags: string[];
  priceRange?: string;
  ownerName?: string;
  lat?: number;
  lng?: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  serviceCategory: string;
  subCategory?: string;
  area: string;
  rating: number;
  reviewCount: number;
  experienceYears?: number;
  startingPrice?: string;
  phone: string;
  whatsapp?: string;
  timing: string;
  isVerified: boolean;
  isFeatured?: boolean;
  image: string;
  galleryImages?: string[];
  servicesOffered: string[];
  description: string;
}

export interface ServiceRequest {
  customerName: string;
  customerPhone: string;
  serviceCategory: string;
  providerName?: string;
  address: string;
  preferredTime: string;
  message?: string;
}

export interface HeroBannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badgeText: string;
  badgeColor?: string;
  ctaText: string;
  ctaLink: string;
  businessId?: string;
}

export interface TodayItem {
  id: string;
  title: string;
  type: 'OFFER' | 'EVENT' | 'ANNOUNCEMENT' | 'NEW_BUSINESS';
  businessName: string;
  badgeText: string;
  timeText: string;
  description: string;
  image: string;
  linkText?: string;
  linkHref?: string;
}

export interface FoodMenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  category: string;
  image: string;
  rating?: number;
  isBestseller?: boolean;
}

export interface CartItem {
  item: FoodMenuItem;
  quantity: number;
  businessName: string;
  businessPhone: string;
  businessWhatsapp: string;
}

export interface OrderState {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  landmark: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
}

export interface JobListing {
  id: string;
  title: string;
  category: string;
  shopName: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Shift' | 'Contract';
  experience: string;
  phone: string;
  whatsapp?: string;
  postedDate: string;
  description: string;
  requirements: string[];
  isVerified: boolean;
  isFeatured?: boolean;
}

export interface RealEstateProperty {
  id: string;
  title: string;
  type: 'Buy' | 'Rent' | 'Lease';
  category: 'Plot' | 'House' | 'Commercial' | 'Agriculture';
  price: string;
  pricePerSqft?: string;
  areaSqft: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  features: string[];
  ownerName: string;
  ownerPhone: string;
  whatsapp?: string;
  postedDate: string;
  isVerified: boolean;
  isFeatured?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  hospitalName: string;
  hospitalAddress: string;
  timings: string;
  consultationFee: string;
  phone: string;
  whatsapp?: string;
  image: string;
  availableDays: string[];
}

export interface HospitalDetail {
  id: string;
  name: string;
  tagline: string;
  address: string;
  landmark: string;
  emergencyPhone: string;
  appointmentPhone: string;
  timing: string;
  image: string;
  departments: string[];
  facilities: string[];
  doctors: Doctor[];
  is24x7: boolean;
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

export interface RoyalPointTransaction {
  id: string;
  amount: number;
  type: 'EARNED' | 'REDEEMED';
  reason: string;
  timestamp: string;
}

export interface RewardVoucher {
  id: string;
  title: string;
  businessName: string;
  pointsCost: number;
  valueDiscount: string;
  image: string;
  expiry: string;
  code: string;
}

export interface Review {
  id: string;
  businessId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  ownerReply?: string;
}

export interface StoryReel {
  id: string;
  title: string;
  businessName: string;
  thumbImage: string;
  mediaType: 'image' | 'video';
  viewsCount: number;
  isNew: boolean;
  linkUrl?: string;
}

export type UserRole = 'CUSTOMER' | 'BUSINESS_OWNER' | 'ADMIN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId?: string;
  createdAt: string;
}

