import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Royal Korutla Database Seeding...');

  // 1. Seed Owner Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@royalkorutla.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'RoyalKorutla@Owner2026!';
  const passwordHash = bcrypt.hashSync(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      id: 'admin-owner-001',
      name: 'Royal Korutla Owner (Admin)',
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
      phone: '+91 98480 12345',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin user created/verified:', admin.email);

  // 2. Seed Categories
  const categories = [
    { id: 'cat-1', name: 'Food & Dining', slug: 'food', iconName: 'Utensils', description: 'Top restaurants, bakeries, tiffin centers & street food in Korutla.', itemCount: 45, badge: 'Hot Deals' },
    { id: 'cat-2', name: 'Groceries & Marts', slug: 'groceries', iconName: 'ShoppingBag', description: 'Fresh vegetables, fruits, supermarkets & daily essentials.', itemCount: 32 },
    { id: 'cat-3', name: 'Shopping & Apparel', slug: 'shopping', iconName: 'Shirt', description: 'Clothing stores, footwear, jewellery & textile showrooms.', itemCount: 58, badge: 'Trending' },
    { id: 'cat-4', name: 'Services & Repair', slug: 'services', iconName: 'Wrench', description: 'Electricians, plumbers, home repair, AC services & carpentry.', itemCount: 64 },
    { id: 'cat-5', name: 'Hospitals & Doctors', slug: 'hospitals', iconName: 'HeartPulse', description: '24/7 Hospitals, diagnostic labs, pharmacies & specialists.', itemCount: 28, badge: '24/7 Care' },
    { id: 'cat-6', name: 'Education & Tuition', slug: 'education', iconName: 'GraduationCap', description: 'Schools, junior colleges, degree institutes & tuition hubs.', itemCount: 39 },
    { id: 'cat-7', name: 'Public Places & Parks', slug: 'public-places', iconName: 'MapPin', description: 'Temples, parks, bus station, municipal services & landmarks.', itemCount: 19 },
    { id: 'cat-8', name: 'Local Jobs', slug: 'jobs', iconName: 'Briefcase', description: 'Sales boys/girls, shop staff, billing, drivers, cooks & technicians.', itemCount: 24, badge: 'Urgent Hiring' },
    { id: 'cat-9', name: 'Real Estate & Rentals', slug: 'real-estate', iconName: 'Home', description: 'Plots, houses for rent, commercial shops & agricultural land.', itemCount: 42 },
    { id: 'cat-10', name: 'Local Businesses', slug: 'businesses', iconName: 'Building2', description: 'Hardware stores, electronics, printing presses & wholesale.', itemCount: 85 },
    { id: 'cat-11', name: 'Offers & Promotions', slug: 'offers', iconName: 'Tag', description: 'Exclusive discounts, festival sales & store coupons in Korutla.', itemCount: 31, badge: 'Save Big' },
    { id: 'cat-12', name: 'Photography & Studios', slug: 'photography', iconName: 'Camera', description: 'Wedding, pre-wedding, event shoots, portraits & video reels in Korutla.', itemCount: 18, badge: 'Trending' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`✅ Seeded ${categories.length} Categories`);

  // 3. Seed Featured Businesses
  const businesses = [
    {
      id: 'biz-1',
      name: 'Royal Paradise Multi-Cuisine Restaurant',
      categorySlug: 'food',
      subCategory: 'Biryani & North Indian',
      rating: 4.8,
      reviewCount: 240,
      address: 'Main Road, Near Old Bus Stand',
      landmark: 'Opposite State Bank of India',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      timing: '11:00 AM - 11:00 PM',
      isVerified: true,
      isFeatured: true,
      promotionType: 'HOMEPAGE_FEATURED',
      promotionLabel: 'PROMOTED',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      description: 'Korutla’s premier AC multi-cuisine dining destination famous for special Hyderabadi dum biryani, tandoori starters, and Chinese delicacies.',
      priceRange: '₹200 - ₹500 for two',
      ownerName: 'Mohammed Ahmed',
    },
    {
      id: 'biz-2',
      name: 'Korutla LifeCare Super Specialty Hospital',
      categorySlug: 'hospitals',
      subCategory: 'General Medicine & Orthopedics',
      rating: 4.9,
      reviewCount: 310,
      address: 'Metpally Highway Road',
      landmark: 'Near Govt Degree College',
      phone: '+91 98480 12345',
      whatsapp: '+91 98480 12345',
      timing: '24 Hours Open',
      isVerified: true,
      isFeatured: true,
      promotionType: 'CATEGORY_FEATURED',
      promotionLabel: 'RK FEATURED',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
      description: 'Multi-specialty hospital equipped with 24/7 Emergency ICU, Digital X-Ray, Pathology Lab, Trauma Care, and Experienced Specialist Doctors.',
      ownerName: 'Dr. K. Srinivas',
    },
    {
      id: 'biz-3',
      name: 'Sri Laxmi Textiles & Silks',
      categorySlug: 'shopping',
      subCategory: 'Wedding & Ethnic Wear',
      rating: 4.7,
      reviewCount: 185,
      address: 'Cloth Market Road',
      landmark: 'Near Venkateshwara Temple',
      phone: '+91 94400 98765',
      whatsapp: '+91 94400 98765',
      timing: '09:30 AM - 09:00 PM',
      isVerified: true,
      isFeatured: true,
      promotionType: 'FESTIVAL_CAMPAIGN',
      promotionLabel: 'SPONSORED',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
      description: 'One-stop showroom for Kanchipuram Pattu sarees, designer lehengas, mens suits, sherwanis, and kids festival wear at wholesale rates.',
      ownerName: 'B. Laxman Rao',
    },
  ];

  for (const b of businesses) {
    await prisma.business.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }
  console.log(`✅ Seeded ${businesses.length} Businesses`);

  // 4. Seed Photography Studios
  const studios = [
    {
      id: 'photo-1',
      name: 'Royal Color Lab & Digital Studio',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      location: 'Main Road, Near Gandhi Statue Center, Korutla',
      landmark: 'Near Gandhi Statue Center',
      phone: '+91 98480 99887',
      whatsapp: '+91 98480 99887',
      instagram: 'https://instagram.com/royalcolorlab_korutla',
      description: 'Leading wedding photography studio in Korutla specializing in cinematic wedding films, candid pre-wedding shoots, 4K video recording, drone shots, and instant photo printing.',
      photographyTypes: ['Wedding', 'Pre-wedding', 'Birthday', 'Events', 'Video', 'Reels'],
      startingPrice: '₹15,000 / Day',
      openingHours: '09:00 AM - 09:00 PM (Mon-Sat)',
      isVerified: true,
      isFeatured: true,
    },
    {
      id: 'photo-2',
      name: 'Sri Sai Digital Studio & Cinematic Films',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
      location: 'High School Road, Opp Old Bus Stand, Korutla',
      landmark: 'Opp Old Bus Stand',
      phone: '+91 94401 22334',
      whatsapp: '+91 94401 22334',
      instagram: 'https://instagram.com/srisaidigital_ktl',
      description: 'Specialist photo studio in Korutla offering high-definition portraits, product photography, outdoor pre-wedding photography, and family event coverage.',
      photographyTypes: ['Portrait', 'Product Photography', 'Birthday', 'Events', 'Video'],
      startingPrice: '₹5,000 / Event',
      openingHours: '09:30 AM - 08:30 PM (Mon-Sat)',
      isVerified: true,
      isFeatured: false,
    },
  ];

  for (const s of studios) {
    await prisma.photographyBusiness.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log(`✅ Seeded ${studios.length} Photography Studios`);

  // 5. Seed Promotions
  const promotions = [
    {
      id: 'prom-1',
      businessId: 'biz-1',
      businessName: 'Royal Paradise Multi-Cuisine Restaurant',
      promotionType: 'HOMEPAGE_FEATURED' as const,
      placement: 'Homepage & Food Top Banner',
      startDate: '2026-09-01',
      endDate: '2026-12-31',
      priority: 1,
      status: 'ACTIVE' as const,
      badgeLabel: 'PROMOTED',
      offerText: '20% OFF Family Combos',
    },
    {
      id: 'prom-2',
      businessId: 'biz-3',
      businessName: 'Sri Laxmi Textiles & Silks',
      promotionType: 'FESTIVAL_CAMPAIGN' as const,
      placement: 'Shopping Section Header',
      startDate: '2026-09-05',
      endDate: '2026-12-31',
      priority: 2,
      status: 'ACTIVE' as const,
      badgeLabel: 'SPONSORED',
      offerText: 'Buy 2 Get 1 FREE',
    },
  ];

  for (const p of promotions) {
    await prisma.promotion.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }
  console.log(`✅ Seeded ${promotions.length} Promotions`);

  console.log('🎉 Royal Korutla Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
