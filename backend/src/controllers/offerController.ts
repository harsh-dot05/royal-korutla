import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess } from '../utils/response';

let memoryOffers: any[] = [
  {
    id: 'offer-1',
    title: 'Flat 20% Off on Biryani & Starters',
    businessName: 'Royal Paradise Restaurant',
    discount: '20% OFF',
    code: 'ROYAL20',
    expiry: '2026-12-31',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&auto=format&fit=crop&q=80',
    tag: 'Food',
    categorySlug: 'food',
    location: 'Main Road, Korutla',
  },
  {
    id: 'offer-2',
    title: 'Buy 2 Get 1 Free on Sarees',
    businessName: 'Sri Laxmi Textiles',
    discount: 'Buy 2 Get 1',
    code: 'TEXTILE3',
    expiry: '2026-11-30',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    tag: 'Shopping',
    categorySlug: 'shopping',
    location: 'Cloth Market Road, Korutla',
  },
  {
    id: 'offer-3',
    title: '₹500 Off on First Photography Booking',
    businessName: 'Korutla Foto Studio',
    discount: '₹500 OFF',
    code: 'PHOTO500',
    expiry: '2026-11-15',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop&q=80',
    tag: 'Photography',
    categorySlug: 'photography',
    location: 'Main Road, Korutla',
  },
];

export const getOffers = async (req: Request, res: Response) => {
  try {
    const categorySlug = req.query.categorySlug as string;
    const where: any = {};
    if (categorySlug && categorySlug !== 'all') where.categorySlug = categorySlug;
    const offers = await prisma.offer.findMany({ where, take: 20, orderBy: { createdAt: 'desc' } });
    return sendSuccess(res, offers, 'Offers retrieved successfully');
  } catch (error) {
    let filtered = memoryOffers;
    const categorySlug = req.query.categorySlug as string;
    if (categorySlug && categorySlug !== 'all') filtered = filtered.filter((o) => o.categorySlug === categorySlug);
    return sendSuccess(res, filtered, 'Offers retrieved (fallback)');
  }
};

export const createOffer = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const newOffer = await prisma.offer.create({
      data: {
        title: String(body.title || ''),
        businessName: String(body.businessName || ''),
        discount: String(body.discount || ''),
        code: body.code ? String(body.code) : undefined,
        expiry: String(body.expiry || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]),
        image: String(body.image || 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&auto=format&fit=crop&q=80'),
        tag: String(body.tag || 'Offer'),
        categorySlug: String(body.categorySlug || 'businesses'),
        location: String(body.location || 'Korutla'),
      },
    });
    memoryOffers.unshift(newOffer as any);
    return sendSuccess(res, newOffer, 'Offer created successfully', 201);
  } catch (error) {
    const fallback = { id: `offer-${Date.now()}`, ...body };
    memoryOffers.unshift(fallback);
    return sendSuccess(res, fallback, 'Offer created (fallback)', 201);
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  try {
    await prisma.offer.delete({ where: { id } });
    memoryOffers = memoryOffers.filter((o) => o.id !== id);
    return sendSuccess(res, null, 'Offer deleted successfully');
  } catch (error) {
    memoryOffers = memoryOffers.filter((o) => o.id !== id);
    return sendSuccess(res, null, 'Offer deleted (fallback)');
  }
};
