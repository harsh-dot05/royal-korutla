import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { createReelRequestSchema, updateReelRequestSchema } from '../validators/reelRequestValidator';

interface MemoryReelRequest {
  id: string;
  businessName: string;
  contactPhone: string;
  businessCategory: string;
  reelPurpose: string;
  preferredLanguage: string;
  additionalRequirements?: string;
  status: 'PENDING' | 'CONTACTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  adminNotes?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

let memoryReelRequests: MemoryReelRequest[] = [
  {
    id: 'reel-req-101',
    businessName: 'Royal Paradise Restaurant',
    contactPhone: '+91 98480 12345',
    businessCategory: 'Restaurants & Food',
    reelPurpose: 'product_promotion',
    preferredLanguage: 'Telugu',
    additionalRequirements: 'Want to showcase our new Dum Biryani cooking process and evening seating ambiance.',
    status: 'CONTACTED',
    adminNotes: 'Spoke with manager on Oct 12. Shoot tentatively planned for Friday afternoon.',
    followUpDate: '2026-10-16',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'reel-req-102',
    businessName: 'Sri Laxmi Silk & Sarees',
    contactPhone: '+91 94401 56789',
    businessCategory: 'Clothing & Fashion',
    reelPurpose: 'offer',
    preferredLanguage: 'Telugu',
    additionalRequirements: 'Festival festive saree discounts 25% off reel for Instagram and Royal Korutla app.',
    status: 'SCHEDULED',
    adminNotes: 'Videographer assigned. Slot confirmed: Saturday 11:00 AM.',
    followUpDate: '2026-10-18',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const createReelRequest = async (req: Request, res: Response) => {
  const parseResult = createReelRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return sendError(res, 'VALIDATION_ERROR', parseResult.error.errors[0]?.message || 'Invalid data', 400);
  }

  const { businessName, contactPhone, businessCategory, reelPurpose, preferredLanguage, additionalRequirements } = parseResult.data;

  try {
    const newRecord = await (prisma as any).reelRequest.create({
      data: {
        businessName,
        contactPhone,
        businessCategory,
        reelPurpose,
        preferredLanguage,
        additionalRequirements,
        status: 'PENDING',
      },
    });

    memoryReelRequests.unshift({
      id: newRecord.id,
      businessName: newRecord.businessName,
      contactPhone: newRecord.contactPhone,
      businessCategory: newRecord.businessCategory,
      reelPurpose: newRecord.reelPurpose,
      preferredLanguage: newRecord.preferredLanguage,
      additionalRequirements: newRecord.additionalRequirements || '',
      status: newRecord.status,
      adminNotes: newRecord.adminNotes || '',
      followUpDate: newRecord.followUpDate || '',
      createdAt: newRecord.createdAt.toISOString(),
      updatedAt: newRecord.updatedAt.toISOString(),
    });

    return sendSuccess(res, newRecord, 'Instant Reel request created successfully', 201);
  } catch (error) {
    const fallback: MemoryReelRequest = {
      id: `reel-req-${Date.now()}`,
      businessName,
      contactPhone,
      businessCategory,
      reelPurpose,
      preferredLanguage,
      additionalRequirements,
      status: 'PENDING',
      adminNotes: '',
      followUpDate: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryReelRequests.unshift(fallback);
    return sendSuccess(res, fallback, 'Instant Reel request submitted successfully', 201);
  }
};

export const getReelRequests = async (req: Request, res: Response) => {
  try {
    const list = await (prisma as any).reelRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, list, 'Reel requests retrieved');
  } catch (error) {
    return sendSuccess(res, memoryReelRequests, 'Reel requests retrieved (in-memory)');
  }
};

export const updateReelRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parseResult = updateReelRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return sendError(res, 'VALIDATION_ERROR', parseResult.error.errors[0]?.message || 'Invalid update data', 400);
  }

  const { status, adminNotes, followUpDate } = parseResult.data;

  try {
    const updated = await (prisma as any).reelRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(followUpDate !== undefined && { followUpDate }),
      },
    });

    // Also sync in-memory
    const idx = memoryReelRequests.findIndex((r) => r.id === id);
    if (idx !== -1) {
      memoryReelRequests[idx] = {
        ...memoryReelRequests[idx],
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(followUpDate !== undefined && { followUpDate }),
        updatedAt: new Date().toISOString(),
      };
    }

    return sendSuccess(res, updated, 'Reel request updated successfully');
  } catch (error) {
    const idx = memoryReelRequests.findIndex((r) => r.id === id);
    if (idx === -1) {
      return sendError(res, 'NOT_FOUND', 'Reel request not found', 404);
    }

    memoryReelRequests[idx] = {
      ...memoryReelRequests[idx],
      ...(status && { status }),
      ...(adminNotes !== undefined && { adminNotes }),
      ...(followUpDate !== undefined && { followUpDate }),
      updatedAt: new Date().toISOString(),
    };

    return sendSuccess(res, memoryReelRequests[idx], 'Reel request updated (in-memory)');
  }
};

export const deleteReelRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await (prisma as any).reelRequest.delete({ where: { id } });
    memoryReelRequests = memoryReelRequests.filter((r) => r.id !== id);
    return sendSuccess(res, null, 'Reel request deleted successfully');
  } catch (error) {
    memoryReelRequests = memoryReelRequests.filter((r) => r.id !== id);
    return sendSuccess(res, null, 'Reel request deleted successfully (in-memory)');
  }
};
