import {
  LocalBusiness,
  BusinessProductService,
  BusinessOfferItem,
  BusinessEnquiry,
  BusinessOrder,
  BusinessSubscription,
  SubscriptionTier,
  ReelRequest,
} from '@/types';
import { FEATURED_BUSINESSES } from '@/data/mockData';
import { getAllReelRequests, createReelRequest } from '@/lib/reelRequestsStore';

// In-memory clones of businesses for mutable dashboard edits
const businessesStore: LocalBusiness[] = JSON.parse(JSON.stringify(FEATURED_BUSINESSES));

// Initial products and services
let productsStore: BusinessProductService[] = [
  // Royal Paradise Restaurant (biz-1)
  {
    id: 'prod-101',
    businessId: 'biz-1',
    name: 'Special Chicken Dum Biryani (Family Pack)',
    description: 'Slow-cooked authentic Hyderabadi aromatic basmati rice layered with tender marinated chicken pieces, served with mirchi ka salan and dahi raita.',
    price: 599,
    priceDisplay: '₹599 (Serves 3-4)',
    isAvailable: true,
    category: 'Biryani & Rice',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    isService: false,
    isVeg: false,
    createdAt: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'prod-102',
    businessId: 'biz-1',
    name: 'Special Chicken Dum Biryani (Single)',
    description: 'Fresh chicken dum biryani with rich saffron aroma, served with cooling raita and gravies.',
    price: 260,
    priceDisplay: '₹260',
    isAvailable: true,
    category: 'Biryani & Rice',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
    isService: false,
    isVeg: false,
    createdAt: new Date('2026-01-02').toISOString(),
  },
  {
    id: 'prod-103',
    businessId: 'biz-1',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes simmered in rich creamy tomato cashew gravy with fenugreek butter.',
    price: 210,
    priceDisplay: '₹210',
    isAvailable: true,
    category: 'North Indian Veg',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    isService: false,
    isVeg: true,
    createdAt: new Date('2026-01-03').toISOString(),
  },
  {
    id: 'prod-104',
    businessId: 'biz-1',
    name: 'Tandoori Chicken (Full)',
    description: 'Whole chicken marinated in yogurt, Kashmiri chilli, and tandoori spices, char-grilled to perfection.',
    price: 390,
    priceDisplay: '₹390',
    isAvailable: true,
    category: 'Starters & Tandoori',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
    isService: false,
    isVeg: false,
    createdAt: new Date('2026-01-04').toISOString(),
  },
  {
    id: 'prod-105',
    businessId: 'biz-1',
    name: 'Butter Garlic Naan (2 Pcs)',
    description: 'Soft leavened tandoor flatbread brushed with crushed garlic and melted butter.',
    price: 80,
    priceDisplay: '₹80',
    isAvailable: true,
    category: 'Breads',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
    isService: false,
    isVeg: true,
    createdAt: new Date('2026-01-05').toISOString(),
  },

  // Sri Laxmi Textiles & Silks (biz-3)
  {
    id: 'prod-301',
    businessId: 'biz-3',
    name: 'Pure Kanchipuram Bridal Pattu Saree',
    description: 'Traditional heavy gold zari borders woven with pure mulberry silk, ideal for weddings and major festivals.',
    price: 4999,
    priceDisplay: '₹4,999 onwards',
    isAvailable: true,
    category: 'Silk Sarees',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    isService: false,
    isVeg: false,
    createdAt: new Date('2026-01-05').toISOString(),
  },
  {
    id: 'prod-302',
    businessId: 'biz-3',
    name: 'Designer Banarasi Georgette Saree',
    description: 'Lightweight floral meenakari zari weaving, contrast rich pallu with running blouse piece.',
    price: 2450,
    priceDisplay: '₹2,450',
    isAvailable: true,
    category: 'Silk Sarees',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    isService: false,
    isVeg: false,
    createdAt: new Date('2026-01-06').toISOString(),
  },
  {
    id: 'prod-303',
    businessId: 'biz-3',
    name: 'Groom Silk Kurta & Pyjama Set',
    description: 'Raw silk textured festive kurta with delicate collar threadwork and churidar.',
    price: 1850,
    priceDisplay: '₹1,850',
    isAvailable: true,
    category: 'Mens Wear',
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&auto=format&fit=crop&q=80',
    isService: false,
    isVeg: false,
    createdAt: new Date('2026-01-07').toISOString(),
  },

  // Sri Sai Ram Electricals (biz-5)
  {
    id: 'prod-501',
    businessId: 'biz-5',
    name: 'Split AC Deep Foam Jet Cleaning',
    description: 'High-pressure foam jet wash for cooling coils, blower wheel cleaning, drain line clearing, and condenser servicing.',
    price: 999,
    priceDisplay: '₹999 / unit',
    isAvailable: true,
    category: 'AC Services',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    isService: true,
    isVeg: false,
    createdAt: new Date('2026-01-10').toISOString(),
  },
  {
    id: 'prod-502',
    businessId: 'biz-5',
    name: 'AC Gas Charging & Leakage Repair',
    description: 'Nitrogen pressure testing, vacuuming, and pure R32/R410 refrigerant charging with 30-day cooling warranty.',
    price: 1800,
    priceDisplay: '₹1,800',
    isAvailable: true,
    category: 'AC Services',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    isService: true,
    isVeg: false,
    createdAt: new Date('2026-01-11').toISOString(),
  },
  {
    id: 'prod-503',
    businessId: 'biz-5',
    name: 'Complete Home Electrical Wiring Inspection',
    description: 'MCB trip troubleshooting, earthing test, concealed wire testing, and switchboard replacement inspection.',
    price: 499,
    priceDisplay: '₹499 inspection fee',
    isAvailable: true,
    category: 'Electrical Repair',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=600&auto=format&fit=crop&q=80',
    isService: true,
    isVeg: false,
    createdAt: new Date('2026-01-12').toISOString(),
  },
];

// Initial Offers
let offersStore: BusinessOfferItem[] = [
  {
    id: 'off-101',
    businessId: 'biz-1',
    businessName: 'Royal Paradise Multi-Cuisine Restaurant',
    title: '20% OFF Family Biryani Bucket & Starters',
    discount: '20% OFF',
    code: 'ROYAL20',
    startDate: '2026-01-01',
    expiry: '2026-12-31',
    terms: 'Applicable on dining & takeaway orders above ₹500. Show coupon code at bill desk or on WhatsApp order.',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    tag: 'POPULAR DEAL',
    createdAt: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'off-102',
    businessId: 'biz-1',
    businessName: 'Royal Paradise Multi-Cuisine Restaurant',
    title: 'Complimentary Dessert on All Weekend Table Bookings',
    discount: 'Free Dessert',
    code: 'SWEETKORUTLA',
    startDate: '2026-01-01',
    expiry: '2026-06-30',
    terms: 'Valid on Saturday & Sunday dinner bookings for groups of 4 or more.',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    tag: 'WEEKEND SPECIAL',
    createdAt: new Date('2026-01-05').toISOString(),
  },
  {
    id: 'off-301',
    businessId: 'biz-3',
    businessName: 'Sri Laxmi Textiles & Silks',
    title: 'Festival Pattu Saree 15% Special Discount',
    discount: '15% OFF',
    code: 'FESTIVE15',
    startDate: '2026-01-01',
    expiry: '2026-11-30',
    terms: 'Valid on pure Kanchipuram and Dharmavaram silk saree purchases above ₹2,500.',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    tag: 'FESTIVAL SPECIAL',
    createdAt: new Date('2026-01-05').toISOString(),
  },
  {
    id: 'off-501',
    businessId: 'biz-5',
    businessName: 'Sri Sai Ram Electricals & AC Service',
    title: 'Flat ₹200 OFF on Complete AC Service Combo',
    discount: '₹200 OFF',
    code: 'SUMMERCOOL',
    startDate: '2026-01-01',
    expiry: '2026-08-31',
    terms: 'Applicable when booking 2 or more AC deep foam services in Korutla municipal limits.',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    tag: 'AC SEASON DEAL',
    createdAt: new Date('2026-01-10').toISOString(),
  },
];

// Initial Customer Enquiries
const enquiriesStore: BusinessEnquiry[] = [
  {
    id: 'enq-101',
    businessId: 'biz-1',
    businessName: 'Royal Paradise Multi-Cuisine Restaurant',
    customerName: 'K. Ramesh Goud',
    customerPhone: '+91 98490 11223',
    customerEmail: 'ramesh.korutla@gmail.com',
    subject: 'Outdoor Catering for Birthday Party (45 Pax)',
    message: 'Hello Ahmed garu, we are planning a 1st birthday party next Sunday evening at Function Hall near Bypass Road. We need Chicken Dum Biryani, Chicken 65, Rumaali Roti, Paneer Butter Masala and Double Ka Meetha for 45 people. Please provide best quote.',
    status: 'NEW',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 'enq-102',
    businessId: 'biz-1',
    businessName: 'Royal Paradise Multi-Cuisine Restaurant',
    customerName: 'Dr. Anitha Reddy',
    customerPhone: '+91 94401 33445',
    customerEmail: 'dr.anitha@lifecare.org',
    subject: 'Table Reservation for Doctors Dinner',
    message: 'Would like to reserve the family AC cabin for 10 people this Friday at 8:30 PM. Please confirm availability.',
    status: 'RESPONDED',
    responseNotes: 'Cabin #2 reserved. Called Dr. Anitha and confirmed booking with starter sampler.',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
  {
    id: 'enq-301',
    businessId: 'biz-3',
    businessName: 'Sri Laxmi Textiles & Silks',
    customerName: 'Sunitha V.',
    customerPhone: '+91 98660 77889',
    subject: 'Bridal Pattu Saree Colors Availability',
    message: 'Do you have bottle green with crimson pink contrast border in pure Kanchipuram silk? Can you share photos on WhatsApp?',
    status: 'NEW',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'enq-501',
    businessId: 'biz-5',
    businessName: 'Sri Sai Ram Electricals & AC Service',
    customerName: 'Ch. Madhusudhan',
    customerPhone: '+91 99890 44556',
    subject: 'Inverter Not Switching to Battery Mode',
    message: 'Luminous 1100VA inverter showing red fault LED during power cuts. Need technician visit near High School Road.',
    status: 'NEW',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
];

// Initial Orders
const ordersStore: BusinessOrder[] = [
  {
    id: 'RK-ORD-910231',
    businessId: 'biz-1',
    businessName: 'Royal Paradise Multi-Cuisine Restaurant',
    customerName: 'Venkatesh Rao',
    customerPhone: '+91 99491 88220',
    deliveryAddress: 'H.No 4-12, Gayatri Nagar, Korutla',
    landmark: 'Near Water Tank',
    notes: 'Please make biryani medium spicy. Send extra onion salad.',
    items: [
      {
        itemId: 'prod-102',
        name: 'Special Chicken Dum Biryani (Single)',
        quantity: 2,
        price: 260,
      },
      {
        itemId: 'prod-103',
        name: 'Paneer Butter Masala',
        quantity: 1,
        price: 210,
      },
      {
        itemId: 'prod-105',
        name: 'Butter Garlic Naan (2 Pcs)',
        quantity: 1,
        price: 80,
      },
    ],
    totalAmount: 810,
    status: 'DISPATCHED',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'RK-ORD-910232',
    businessId: 'biz-1',
    businessName: 'Royal Paradise Multi-Cuisine Restaurant',
    customerName: 'Pooja Sharma',
    customerPhone: '+91 98490 66778',
    deliveryAddress: 'Flat 201, Srinivasa Towers, Main Road',
    landmark: 'Opposite State Bank of India',
    notes: 'Please dispatch before 2:00 PM for lunch.',
    items: [
      {
        itemId: 'prod-101',
        name: 'Special Chicken Dum Biryani (Family Pack)',
        quantity: 1,
        price: 599,
      },
      {
        itemId: 'prod-104',
        name: 'Tandoori Chicken (Full)',
        quantity: 1,
        price: 390,
      },
    ],
    totalAmount: 989,
    status: 'ACCEPTED',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'RK-ORD-910233',
    businessId: 'biz-1',
    businessName: 'Royal Paradise Multi-Cuisine Restaurant',
    customerName: 'Mohd Farooq',
    customerPhone: '+91 97000 12345',
    deliveryAddress: 'Near Jamia Masjid, Korutla',
    landmark: 'Beside Unani Clinic',
    items: [
      {
        itemId: 'prod-102',
        name: 'Special Chicken Dum Biryani (Single)',
        quantity: 1,
        price: 260,
      },
    ],
    totalAmount: 260,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];

// Initial Business Subscriptions
const subscriptionMap: Record<string, BusinessSubscription> = {
  'biz-1': {
    plan: 'PLATINUM_ROYAL',
    planName: 'Platinum Royal Tier',
    status: 'ACTIVE',
    renewalDate: '2026-12-31',
    paymentStatus: 'PAID',
    pricePerMonth: 999,
    features: [
      'Top Homepage Banner Spotlight',
      'Verified Gold Shield & Town Trust Badge',
      'Unlimited Product & WhatsApp Catalog Items',
      'Priority Customer Leads & Direct Dial Routing',
      'Free Monthly 4K Video Reel Shoot by RK Team',
      'Dedicated Google SEO Storefront Page',
    ],
  },
  'biz-3': {
    plan: 'GOLD_VERIFIED',
    planName: 'Gold Verified Merchant',
    status: 'ACTIVE',
    renewalDate: '2026-11-15',
    paymentStatus: 'PAID',
    pricePerMonth: 499,
    features: [
      'Category Header Spotlight Placement',
      'Verified Merchant Badge',
      'Up to 50 Product Catalog Items',
      'WhatsApp Click-to-Chat Leads',
      'Discounted Reel Production Access',
    ],
  },
  'biz-5': {
    plan: 'SILVER_MERCHANT',
    planName: 'Silver Town Merchant',
    status: 'ACTIVE',
    renewalDate: '2026-10-30',
    paymentStatus: 'PAID',
    pricePerMonth: 299,
    features: [
      'Local Services Directory Listing',
      'Phone & WhatsApp Enquiries',
      'Up to 15 Service Showcase Cards',
      'Basic Customer Reviews & Ratings',
    ],
  },
};

// ==================== BUSINESS PROFILE ====================

export function getBusinessProfile(businessId: string): LocalBusiness | null {
  return businessesStore.find((b) => b.id === businessId) || null;
}

export function updateBusinessProfile(
  businessId: string,
  updates: Partial<LocalBusiness>
): LocalBusiness | null {
  const index = businessesStore.findIndex((b) => b.id === businessId);
  if (index === -1) return null;

  businessesStore[index] = {
    ...businessesStore[index],
    ...updates,
    id: businessId, // Immutable ID
  };

  return businessesStore[index];
}

// ==================== PRODUCTS & SERVICES ====================

export function getProductsByBusinessId(businessId: string): BusinessProductService[] {
  return productsStore.filter((p) => p.businessId === businessId);
}

export function getProductById(id: string): BusinessProductService | null {
  return productsStore.find((p) => p.id === id) || null;
}

export function createProduct(
  businessId: string,
  data: Omit<BusinessProductService, 'id' | 'businessId' | 'createdAt'>
): BusinessProductService {
  const newProduct: BusinessProductService = {
    ...data,
    id: `prod-${Date.now()}`,
    businessId,
    createdAt: new Date().toISOString(),
  };

  productsStore.unshift(newProduct);
  return newProduct;
}

export function updateProduct(
  id: string,
  businessId: string,
  updates: Partial<Omit<BusinessProductService, 'id' | 'businessId' | 'createdAt'>>
): BusinessProductService | null {
  const index = productsStore.findIndex((p) => p.id === id && p.businessId === businessId);
  if (index === -1) return null;

  productsStore[index] = {
    ...productsStore[index],
    ...updates,
  };

  return productsStore[index];
}

export function deleteProduct(id: string, businessId: string): boolean {
  const initialLen = productsStore.length;
  productsStore = productsStore.filter((p) => !(p.id === id && p.businessId === businessId));
  return productsStore.length < initialLen;
}

// ==================== OFFERS & PROMOTIONS ====================

export function getOffersByBusinessId(businessId: string): BusinessOfferItem[] {
  return offersStore.filter((o) => o.businessId === businessId);
}

export function getOfferById(id: string): BusinessOfferItem | null {
  return offersStore.find((o) => o.id === id) || null;
}

export function createOffer(
  businessId: string,
  businessName: string,
  data: Omit<BusinessOfferItem, 'id' | 'businessId' | 'businessName' | 'createdAt'>
): BusinessOfferItem {
  const newOffer: BusinessOfferItem = {
    ...data,
    id: `off-${Date.now()}`,
    businessId,
    businessName,
    createdAt: new Date().toISOString(),
  };

  offersStore.unshift(newOffer);
  return newOffer;
}

export function updateOffer(
  id: string,
  businessId: string,
  updates: Partial<Omit<BusinessOfferItem, 'id' | 'businessId' | 'businessName' | 'createdAt'>>
): BusinessOfferItem | null {
  const index = offersStore.findIndex((o) => o.id === id && o.businessId === businessId);
  if (index === -1) return null;

  offersStore[index] = {
    ...offersStore[index],
    ...updates,
  };

  return offersStore[index];
}

export function deleteOffer(id: string, businessId: string): boolean {
  const initialLen = offersStore.length;
  offersStore = offersStore.filter((o) => !(o.id === id && o.businessId === businessId));
  return offersStore.length < initialLen;
}

// ==================== CUSTOMER ENQUIRIES ====================

export function getEnquiriesByBusinessId(businessId: string): BusinessEnquiry[] {
  return enquiriesStore.filter((e) => e.businessId === businessId);
}

export function getEnquiryById(id: string): BusinessEnquiry | null {
  return enquiriesStore.find((e) => e.id === id) || null;
}

export function updateEnquiryStatus(
  id: string,
  businessId: string,
  status: BusinessEnquiry['status'],
  responseNotes?: string
): BusinessEnquiry | null {
  const index = enquiriesStore.findIndex((e) => e.id === id && e.businessId === businessId);
  if (index === -1) return null;

  enquiriesStore[index] = {
    ...enquiriesStore[index],
    status,
    responseNotes: responseNotes !== undefined ? responseNotes : enquiriesStore[index].responseNotes,
    updatedAt: new Date().toISOString(),
  };

  return enquiriesStore[index];
}

export function createEnquiry(
  businessId: string,
  data: Omit<BusinessEnquiry, 'id' | 'businessId' | 'status' | 'createdAt'>
): BusinessEnquiry {
  const newEnquiry: BusinessEnquiry = {
    ...data,
    id: `enq-${Date.now()}`,
    businessId,
    status: 'NEW',
    createdAt: new Date().toISOString(),
  };

  enquiriesStore.unshift(newEnquiry);
  return newEnquiry;
}

// ==================== ORDERS ====================

export function getOrdersByBusinessId(businessId: string): BusinessOrder[] {
  return ordersStore.filter((o) => o.businessId === businessId);
}

export function getOrderById(id: string): BusinessOrder | null {
  return ordersStore.find((o) => o.id === id) || null;
}

export function updateOrderStatus(
  id: string,
  businessId: string,
  status: BusinessOrder['status']
): BusinessOrder | null {
  const index = ordersStore.findIndex((o) => o.id === id && o.businessId === businessId);
  if (index === -1) return null;

  ordersStore[index] = {
    ...ordersStore[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  return ordersStore[index];
}

export function recordOrder(data: Omit<BusinessOrder, 'id' | 'createdAt' | 'updatedAt'>): BusinessOrder {
  const newOrder: BusinessOrder = {
    ...data,
    id: `RK-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  ordersStore.unshift(newOrder);
  return newOrder;
}

// ==================== REEL REQUESTS FOR BUSINESS ====================

export function getReelRequestsForBusiness(businessName: string, phone?: string): ReelRequest[] {
  const allReels = getAllReelRequests();
  const lowerName = businessName.toLowerCase().trim();
  const cleanPhone = phone?.replace(/\D/g, '') || '';

  return allReels.filter((reel) => {
    const reelName = reel.businessName.toLowerCase().trim();
    const reelPhone = reel.contactPhone.replace(/\D/g, '');

    const nameMatch = reelName.includes(lowerName) || lowerName.includes(reelName);
    const phoneMatch = cleanPhone && reelPhone && (cleanPhone.endsWith(reelPhone.slice(-8)) || reelPhone.endsWith(cleanPhone.slice(-8)));

    return nameMatch || phoneMatch;
  });
}

export function submitBusinessReelRequest(
  businessName: string,
  contactPhone: string,
  businessCategory: string,
  reelPurpose: ReelRequest['reelPurpose'],
  preferredLanguage: 'Telugu' | 'English',
  additionalRequirements?: string
): ReelRequest {
  return createReelRequest({
    businessName,
    contactPhone,
    businessCategory,
    reelPurpose,
    preferredLanguage,
    additionalRequirements,
    adminNotes: 'Submitted directly from Business Owner Dashboard',
  });
}

// ==================== SUBSCRIPTIONS ====================

export function getBusinessSubscription(businessId: string): BusinessSubscription {
  if (subscriptionMap[businessId]) {
    return subscriptionMap[businessId];
  }

  // Default fallback for any newly registered or other business
  return {
    plan: 'FREE' as SubscriptionTier,
    planName: 'Basic Business Listing',
    status: 'ACTIVE',
    renewalDate: '2027-01-01',
    paymentStatus: 'PAID',
    pricePerMonth: 0,
    features: [
      'Standard Town Directory Listing',
      'Verified Phone & Address Visibility',
      'Customer Google Maps Directions',
    ],
  };
}
