import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess } from '../utils/response';
import { INITIAL_PHOTOGRAPHY_STUDIOS } from '../utils/seedData';

let memoryStudios = [...INITIAL_PHOTOGRAPHY_STUDIOS];

export const getPhotographyStudios = async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;
    const q = req.query.q as string;

    const where: any = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    let studios = await prisma.photographyBusiness.findMany({
      where,
      include: { galleryImages: true },
      orderBy: { createdAt: 'desc' },
    });

    if (type && type !== 'All') {
      studios = studios.filter((s) => s.photographyTypes.includes(type));
    }

    return sendSuccess(res, studios, 'Photography listings retrieved');
  } catch (error) {
    let filtered = memoryStudios;
    const type = req.query.type as string;
    const q = req.query.q as string;

    if (type && type !== 'All') {
      filtered = filtered.filter((s) => s.photographyTypes.includes(type));
    }

    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(lower) ||
          s.location.toLowerCase().includes(lower) ||
          s.description.toLowerCase().includes(lower)
      );
    }

    return sendSuccess(res, filtered, 'Photography listings retrieved (fallback)');
  }
};

export const createPhotographyStudio = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const newStudio = await prisma.photographyBusiness.create({
      data: {
        name: body.name,
        profileImage: body.profileImage || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop&q=80',
        coverImage: body.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
        location: body.location || 'Main Road, Korutla',
        landmark: body.landmark || 'Near Gandhi Statue',
        phone: body.phone,
        whatsapp: body.whatsapp || body.phone,
        instagram: body.instagram || '@korutlaphotography',
        description: body.description || 'Professional photo studio in Korutla.',
        photographyTypes: body.photographyTypes || ['Wedding', 'Portrait', 'Events'],
        startingPrice: body.startingPrice || '₹15,000 / day',
        openingHours: body.openingHours || '09:00 AM - 09:00 PM',
        isVerified: body.isVerified ?? true,
        isFeatured: body.isFeatured ?? false,
      },
    });

    memoryStudios.unshift(newStudio as any);
    return sendSuccess(res, newStudio, 'Photography studio created successfully', 201);
  } catch (error) {
    const fallbackStudio = {
      id: `photo-${Date.now()}`,
      ...body,
      isVerified: body.isVerified ?? true,
      isFeatured: body.isFeatured ?? false,
      galleryImages: [],
    };
    memoryStudios.unshift(fallbackStudio);
    return sendSuccess(res, fallbackStudio, 'Photography studio created successfully (fallback)', 201);
  }
};

export const updatePhotographyStudio = async (req: Request, res: Response) => {
  const rawId = req.body.id || req.params.id;
  const id = String(rawId || '');

  try {
    const updated = await prisma.photographyBusiness.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, updated, 'Photography studio updated successfully');
  } catch (error) {
    const idx = memoryStudios.findIndex((s) => s.id === id);
    if (idx !== -1) {
      memoryStudios[idx] = { ...memoryStudios[idx], ...req.body };
      return sendSuccess(res, memoryStudios[idx], 'Photography studio updated successfully (fallback)');
    }
    return sendSuccess(res, null, 'Photography studio not found', 404);
  }
};

export const deletePhotographyStudio = async (req: Request, res: Response) => {
  const rawId = req.query.id || req.params.id;
  const id = String(rawId || '');

  try {
    await prisma.photographyBusiness.delete({ where: { id } });
    memoryStudios = memoryStudios.filter((s) => s.id !== id);
    return sendSuccess(res, null, 'Photography studio deleted successfully');
  } catch (error) {
    memoryStudios = memoryStudios.filter((s) => s.id !== id);
    return sendSuccess(res, null, 'Photography studio deleted successfully (fallback)');
  }
};
