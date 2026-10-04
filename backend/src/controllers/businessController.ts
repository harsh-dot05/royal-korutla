import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess } from '../utils/response';
import { INITIAL_BUSINESSES } from '../utils/seedData';

let memoryBusinesses = [...INITIAL_BUSINESSES];

export const getBusinesses = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const q = req.query.q as string;
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '50', 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category && category !== 'all') {
      where.categorySlug = category;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
        { subCategory: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.business.count({ where }),
    ]);

    return sendSuccess(
      res,
      {
        items: businesses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      'Businesses retrieved successfully'
    );
  } catch (error) {
    let filtered = memoryBusinesses;
    const category = req.query.category as string;
    const q = req.query.q as string;

    if (category && category !== 'all') {
      filtered = filtered.filter((b) => b.categorySlug === category);
    }
    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(lower) ||
          b.address.toLowerCase().includes(lower) ||
          b.subCategory.toLowerCase().includes(lower)
      );
    }

    return sendSuccess(
      res,
      {
        items: filtered,
        total: filtered.length,
        page: 1,
        limit: 50,
        totalPages: 1,
      },
      'Businesses retrieved successfully (fallback)'
    );
  }
};

export const getBusinessById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        galleryImages: true,
        tags: true,
        reviews: true,
      },
    });

    if (business) {
      return sendSuccess(res, business, 'Business detail retrieved');
    }
  } catch (error) {
    // fallback
  }

  const found = memoryBusinesses.find((b) => b.id === id);
  if (found) {
    return sendSuccess(res, found, 'Business detail retrieved (fallback)');
  }

  return sendSuccess(res, null, 'Business not found', 404);
};

export const createBusiness = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const newBusiness = await prisma.business.create({
      data: {
        name: body.name,
        categorySlug: body.categorySlug,
        subCategory: body.subCategory || 'Local Business',
        phone: body.phone,
        whatsapp: body.whatsapp || body.phone,
        address: body.address,
        landmark: body.landmark || 'Korutla Town',
        timing: body.timing || '09:00 AM - 09:00 PM',
        image: body.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
        isVerified: body.isVerified ?? true,
        isFeatured: body.isFeatured ?? false,
        description: body.description,
        priceRange: body.priceRange,
        ownerName: body.ownerName,
      },
    });

    memoryBusinesses.unshift(newBusiness as any);
    return sendSuccess(res, newBusiness, 'Business created successfully', 201);
  } catch (error) {
    const fallbackBiz = {
      id: `biz-${Date.now()}`,
      ...body,
      isVerified: body.isVerified ?? true,
      isFeatured: body.isFeatured ?? false,
    };
    memoryBusinesses.unshift(fallbackBiz);
    return sendSuccess(res, fallbackBiz, 'Business created successfully (fallback)', 201);
  }
};

export const updateBusiness = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const body = req.body;

  try {
    const updated = await prisma.business.update({
      where: { id },
      data: body,
    });
    return sendSuccess(res, updated, 'Business updated successfully');
  } catch (error) {
    const idx = memoryBusinesses.findIndex((b) => b.id === id);
    if (idx !== -1) {
      memoryBusinesses[idx] = { ...memoryBusinesses[idx], ...body };
      return sendSuccess(res, memoryBusinesses[idx], 'Business updated successfully (fallback)');
    }
    return sendSuccess(res, null, 'Business not found', 404);
  }
};

export const deleteBusiness = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    await prisma.business.delete({ where: { id } });
    memoryBusinesses = memoryBusinesses.filter((b) => b.id !== id);
    return sendSuccess(res, null, 'Business deleted successfully');
  } catch (error) {
    memoryBusinesses = memoryBusinesses.filter((b) => b.id !== id);
    return sendSuccess(res, null, 'Business deleted successfully (fallback)');
  }
};
