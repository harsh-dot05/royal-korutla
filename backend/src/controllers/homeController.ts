import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess } from '../utils/response';

export const getHomepagePayload = async (req: Request, res: Response) => {
  try {
    const [slider, categories, featuredBusinesses, offers, emergencyContacts] = await Promise.all([
      prisma.heroSlide.findMany({ orderBy: { priority: 'asc' } }).catch(() => []),
      prisma.category.findMany({ orderBy: { name: 'asc' } }).catch(() => []),
      prisma.business.findMany({ where: { isFeatured: true }, take: 10 }).catch(() => []),
      prisma.offer.findMany({ take: 6 }).catch(() => []),
      prisma.emergencyContact.findMany().catch(() => []),
    ]);

    return sendSuccess(
      res,
      {
        slider,
        categories,
        featuredBusinesses,
        offers,
        emergencyContacts,
      },
      'Royal Korutla Homepage Payload'
    );
  } catch (error) {
    return sendSuccess(res, {}, 'Royal Korutla Homepage Payload');
  }
};
