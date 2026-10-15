import { z } from 'zod';

export const createReelRequestSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  contactPhone: z.string().min(10, 'Contact number must be at least 10 digits'),
  businessCategory: z.string().min(2, 'Category is required'),
  reelPurpose: z.enum([
    'product_promotion',
    'offer',
    'shop_introduction',
    'event',
    'other',
  ]).default('product_promotion'),
  preferredLanguage: z.enum(['Telugu', 'English']).default('Telugu'),
  additionalRequirements: z.string().optional().default(''),
});

export const updateReelRequestSchema = z.object({
  status: z.enum(['PENDING', 'CONTACTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
  adminNotes: z.string().optional(),
  followUpDate: z.string().optional(),
});
