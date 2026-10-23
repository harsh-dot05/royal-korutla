export type CategorySlug = 
  | 'food'
  | 'groceries'
  | 'clothing'
  | 'shopping'
  | 'services'
  | 'hospitals'
  | 'education'
  | 'public-places'
  | 'jobs'
  | 'real-estate'
  | 'businesses'
  | 'offers'
  | 'photography';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  iconName: string;
  description: string;
  itemCount: number;
  badge?: string;
  colorGradient: string;
  isActive?: boolean;
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
  mobileImage?: string;
  badgeText: string;
  badgeColor?: string;
  ctaText: string;
  ctaLink: string;
  businessId?: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
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
  badgeLabel?: string;
  badgeColor?: string;
  cardColorTheme?: string;
}

export interface RealEstateProperty {
  id: string;
  title: string;
  type: 'Buy' | 'Rent' | 'Lease' | 'Sell';
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
  isVerified?: boolean;
  notes?: string;
  timing?: string;
  updatedAt?: string;
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

export type PointTransactionType = 'EARNED' | 'REDEEMED';

export type PointTransactionCategory =
  | 'SIGNUP'
  | 'REFERRAL'
  | 'ACTIVITY'
  | 'REDEMPTION'
  | 'ADJUSTMENT'
  | 'REVERSAL';

export interface RoyalPointTransaction {
  id: string;
  userId?: string;
  userEmail?: string;
  amount: number;
  type: PointTransactionType;
  category?: PointTransactionCategory;
  reason: string;
  timestamp: string;
  referenceId?: string;
  createdAt?: string;
}

export type ReferralStatus = 'PENDING_QUALIFYING' | 'QUALIFIED' | 'REWARDED' | 'FLAGGED_ABUSE';

export interface ReferralRecord {
  id: string;
  inviterUserId: string;
  inviterName: string;
  inviterEmail: string;
  invitedUserId: string;
  invitedName: string;
  invitedEmail: string;
  invitedPhone?: string;
  referralCode: string;
  status: ReferralStatus;
  pointsAwarded: number;
  createdAt: string;
  qualifiedAt?: string;
  flagReason?: string;
}

export interface ConfigurableRewardBenefit {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  isActive: boolean;
  minOrderValue?: number;
  validityDays: number;
  eligibilityRules: string[];
  termsAndConditions: string;
  updatedAt: string;
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

export type UserRole = 'CUSTOMER' | 'BUSINESS_OWNER' | 'ADMIN' | 'SUPER_ADMIN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId?: string;
  createdAt: string;
}

export type PhotographyType =
  | 'Wedding'
  | 'Pre-wedding'
  | 'Birthday'
  | 'Events'
  | 'Portrait'
  | 'Product Photography'
  | 'Video'
  | 'Reels'
  | 'Drone'
  | 'Newborn'
  | 'Studio'
  | 'Fashion'
  | 'Commercial';

export interface PhotographyBusiness {
  id: string;
  name: string;
  profileImage: string;
  coverImage: string;
  location: string;
  landmark?: string;
  phone: string;
  whatsapp?: string;
  instagram?: string;
  description: string;
  photographyTypes: PhotographyType[];
  startingPrice?: string;
  openingHours: string;
  isVerified: boolean;
  isFeatured: boolean;
  galleryImages: string[];
  rating?: number;
  reviewCount?: number;
}

export type Business = LocalBusiness;
export type FeaturedBusiness = LocalBusiness;
export type HomepageSlide = HeroBannerSlide;

export type RepresentativeRole = 'MLA' | 'MUNICIPAL_CHAIRMAN' | 'WARD_COUNCILLOR';

export interface PublicRepresentative {
  id: string;
  role: RepresentativeRole;
  name: string;
  designation: string;
  wardNumber?: number;
  constituency?: string;
  areaName?: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
  officeAddress?: string;
  termPeriod?: string;
  isVerified: boolean;
  updatedAt: string;
}

export type ReelPurpose =
  | 'product_promotion'
  | 'offer'
  | 'shop_introduction'
  | 'event'
  | 'other';

export type ReelRequestStatus =
  | 'PENDING'
  | 'CONTACTED'
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ReelRequest {
  id: string;
  businessName: string;
  contactPhone: string;
  businessCategory: string;
  reelPurpose: ReelPurpose;
  preferredLanguage: 'Telugu' | 'English';
  additionalRequirements?: string;
  status: ReelRequestStatus;
  adminNotes?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionTier =
  | 'FREE'
  | 'SILVER_MERCHANT'
  | 'GOLD_VERIFIED'
  | 'PLATINUM_ROYAL';

export type SubscriptionPaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface BusinessSubscription {
  plan: SubscriptionTier;
  planName: string;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'TRIAL';
  renewalDate: string;
  paymentStatus: SubscriptionPaymentStatus;
  pricePerMonth: number;
  features: string[];
}

export interface BusinessProductService {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  priceDisplay?: string;
  isAvailable: boolean;
  category: string;
  image: string;
  isService?: boolean;
  isVeg?: boolean;
  createdAt: string;
}

export interface BusinessOfferItem {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  discount: string;
  code?: string;
  startDate?: string;
  expiry: string;
  terms?: string;
  isActive: boolean;
  image: string;
  tag?: string;
  categorySlug?: CategorySlug;
  location?: string;
  createdAt: string;
}

export type BusinessEnquiryStatus = 'NEW' | 'RESPONDED' | 'CLOSED';

export interface BusinessEnquiry {
  id: string;
  businessId: string;
  businessName?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  subject: string;
  message: string;
  status: BusinessEnquiryStatus;
  responseNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type BusinessOrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DISPATCHED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface BusinessOrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface BusinessOrder {
  id: string;
  businessId: string;
  businessName: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  landmark?: string;
  notes?: string;
  items: BusinessOrderItem[];
  totalAmount: number;
  status: BusinessOrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessOwnerAccount {
  id: string;
  email: string;
  phone: string;
  name: string;
  password_hash: string;
  businessId: string;
  businessName: string;
  role: 'BUSINESS_OWNER';
  isActive: boolean;
  createdAt: string;
}

export type SafeBusinessOwnerAccount = Omit<BusinessOwnerAccount, 'password_hash'>;


