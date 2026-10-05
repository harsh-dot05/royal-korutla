import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess } from '../utils/response';

let memoryCategories: any[] = [
  { id: 'cat-1', name: 'Food & Dining', slug: 'food', iconName: 'Utensils', description: 'Top restaurants, bakeries, tiffin centers & street food in Korutla.', itemCount: 45, badge: 'Hot Deals', colorGradient: 'bg-blue-600' },
  { id: 'cat-2', name: 'Groceries & Marts', slug: 'groceries', iconName: 'ShoppingBag', description: 'Fresh vegetables, fruits, supermarkets & daily essentials.', itemCount: 32, colorGradient: 'bg-blue-600' },
  { id: 'cat-3', name: 'Shopping & Apparel', slug: 'shopping', iconName: 'Shirt', description: 'Clothing stores, footwear, jewellery & textile showrooms.', itemCount: 58, badge: 'Trending', colorGradient: 'bg-blue-600' },
  { id: 'cat-4', name: 'Services & Repair', slug: 'services', iconName: 'Wrench', description: 'Electricians, plumbers, home repair, AC services & carpentry.', itemCount: 64, colorGradient: 'bg-blue-600' },
  { id: 'cat-5', name: 'Hospitals & Doctors', slug: 'hospitals', iconName: 'HeartPulse', description: '24/7 Hospitals, diagnostic labs, pharmacies & specialists.', itemCount: 28, badge: '24/7 Care', colorGradient: 'bg-blue-600' },
  { id: 'cat-6', name: 'Education & Tuition', slug: 'education', iconName: 'GraduationCap', description: 'Schools, junior colleges, degree institutes & tuition hubs.', itemCount: 39, colorGradient: 'bg-blue-600' },
  { id: 'cat-7', name: 'Public Places & Parks', slug: 'public-places', iconName: 'MapPin', description: 'Temples, parks, bus station, municipal services & landmarks.', itemCount: 19, colorGradient: 'bg-blue-600' },
  { id: 'cat-8', name: 'Local Jobs', slug: 'jobs', iconName: 'Briefcase', description: 'Sales boys/girls, shop staff, billing, drivers, cooks & technicians.', itemCount: 24, badge: 'Urgent Hiring', colorGradient: 'bg-blue-600' },
  { id: 'cat-9', name: 'Real Estate & Rentals', slug: 'real-estate', iconName: 'Home', description: 'Plots, houses for rent, commercial shops & agricultural land.', itemCount: 42, colorGradient: 'bg-blue-600' },
  { id: 'cat-10', name: 'Local Businesses', slug: 'businesses', iconName: 'Building2', description: 'Hardware stores, electronics, printing presses & wholesale.', itemCount: 85, colorGradient: 'bg-blue-600' },
  { id: 'cat-11', name: 'Offers & Promotions', slug: 'offers', iconName: 'Tag', description: 'Exclusive discounts, festival sales & store coupons in Korutla.', itemCount: 31, badge: 'Save Big', colorGradient: 'bg-blue-600' },
  { id: 'cat-12', name: 'Photography & Studios', slug: 'photography', iconName: 'Camera', description: 'Wedding, pre-wedding, event shoots, portraits & video reels in Korutla.', itemCount: 18, badge: 'Trending', colorGradient: 'bg-blue-600' },
];

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    if (categories.length > 0) return sendSuccess(res, categories, 'Categories retrieved');
    return sendSuccess(res, memoryCategories, 'Categories retrieved (seeded)');
  } catch (error) {
    return sendSuccess(res, memoryCategories, 'Categories retrieved (fallback)');
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const [
      businessCount,
      photographyCount,
      jobCount,
      propertyCount,
      hospitalCount,
      serviceCount,
      orderCount,
      promotionCount,
    ] = await Promise.all([
      prisma.business.count().catch(() => 0),
      prisma.photographyBusiness.count().catch(() => 0),
      prisma.jobListing.count().catch(() => 0),
      prisma.realEstateProperty.count().catch(() => 0),
      prisma.hospital.count().catch(() => 0),
      prisma.serviceProvider.count().catch(() => 0),
      prisma.order.count().catch(() => 0),
      prisma.promotion.count({ where: { status: 'ACTIVE' } }).catch(() => 0),
    ]);

    return sendSuccess(res, {
      businesses: businessCount,
      photography: photographyCount,
      jobs: jobCount,
      properties: propertyCount,
      hospitals: hospitalCount,
      services: serviceCount,
      orders: orderCount,
      activePromotions: promotionCount,
      totalListings: businessCount + photographyCount + jobCount + propertyCount + hospitalCount + serviceCount,
    }, 'Platform statistics');
  } catch (error) {
    return sendSuccess(res, {
      businesses: 85,
      photography: 18,
      jobs: 24,
      properties: 42,
      hospitals: 28,
      services: 64,
      orders: 0,
      activePromotions: 0,
      totalListings: 261,
    }, 'Platform statistics (fallback)');
  }
};

export const getHomepagePayload = async (req: Request, res: Response) => {
  try {
    const [slider, featuredBusinesses, offers, emergencyContacts, activePromotions] = await Promise.all([
      prisma.heroSlide.findMany({ orderBy: { priority: 'asc' } }).catch(() => []),
      prisma.business.findMany({ where: { isFeatured: true }, take: 10, orderBy: { createdAt: 'desc' } }).catch(() => []),
      prisma.offer.findMany({ take: 6, orderBy: { createdAt: 'desc' } }).catch(() => []),
      prisma.emergencyContact.findMany().catch(() => []),
      prisma.promotion.findMany({
        where: { status: 'ACTIVE', endDate: { gte: new Date().toISOString().split('T')[0] } },
        orderBy: { priority: 'asc' },
        take: 5,
      }).catch(() => []),
    ]);

    return sendSuccess(res, {
      slider,
      categories: memoryCategories,
      featuredBusinesses,
      offers,
      emergencyContacts,
      activePromotions,
    }, 'Royal Korutla Homepage Payload');
  } catch (error) {
    return sendSuccess(res, {
      slider: [],
      categories: memoryCategories,
      featuredBusinesses: [],
      offers: [],
      emergencyContacts: [],
      activePromotions: [],
    }, 'Royal Korutla Homepage Payload (fallback)');
  }
};
