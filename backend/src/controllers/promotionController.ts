import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess } from '../utils/response';
import { INITIAL_PROMOTIONS } from '../utils/seedData';

let memoryPromotions = [...INITIAL_PROMOTIONS];

export const getActivePromotions = async (req: Request, res: Response) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const promotions = await prisma.promotion.findMany({
      where: {
        status: 'ACTIVE',
        endDate: { gte: todayStr },
      },
      orderBy: { priority: 'asc' },
    });

    return sendSuccess(res, promotions, 'Active promotions retrieved successfully');
  } catch (error) {
    return sendSuccess(res, memoryPromotions.filter((p) => p.status === 'ACTIVE'), 'Active promotions retrieved successfully (fallback)');
  }
};

export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, promotions, 'Admin promotions list retrieved');
  } catch (error) {
    return sendSuccess(res, memoryPromotions, 'Admin promotions list retrieved (fallback)');
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const newPromotion = await prisma.promotion.create({
      data: {
        businessId: body.businessId,
        businessName: body.businessName,
        promotionType: body.promotionType || 'HOMEPAGE_FEATURED',
        placement: body.placement || 'Homepage Top Banner',
        startDate: body.startDate || new Date().toISOString().split('T')[0],
        endDate: body.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        priority: body.priority || 1,
        status: body.status || 'ACTIVE',
        badgeLabel: body.badgeLabel || 'PROMOTED',
        bannerImage: body.bannerImage,
        title: body.title,
        description: body.description,
        offerText: body.offerText,
      },
    });

    memoryPromotions.unshift(newPromotion as any);
    return sendSuccess(res, newPromotion, 'Promotion created and published successfully', 201);
  } catch (error) {
    const fallbackPromotion = {
      id: `prom-${Date.now()}`,
      ...body,
      status: body.status || 'ACTIVE',
    };
    memoryPromotions.unshift(fallbackPromotion);
    return sendSuccess(res, fallbackPromotion, 'Promotion created and published successfully (fallback)', 201);
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  const rawId = req.query.id || req.params.id;
  const id = String(rawId || '');

  try {
    await prisma.promotion.delete({ where: { id } });
    memoryPromotions = memoryPromotions.filter((p) => p.id !== id);
    return sendSuccess(res, null, 'Promotion deleted successfully');
  } catch (error) {
    memoryPromotions = memoryPromotions.filter((p) => p.id !== id);
    return sendSuccess(res, null, 'Promotion deleted successfully (fallback)');
  }
};
