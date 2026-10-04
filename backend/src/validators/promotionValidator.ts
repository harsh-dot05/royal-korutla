import { z } from 'zod';

export const createPromotionSchema = z.object({
  businessId: z.string().optional(),
  businessName: z.string().min(2, { message: 'Business name is required' }),
  promotionType: z.enum([
    'FEATURED_BUSINESS',
    'HOMEPAGE_FEATURED',
    'CATEGORY_FEATURED',
    'SPONSORED_OFFER',
    'FESTIVAL_CAMPAIGN',
    'BUSINESS_OF_THE_WEEK',
  ]).default('HOMEPAGE_FEATURED'),
  placement: z.string().default('Homepage Top Banner'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  priority: z.number().default(1),
  status: z.enum(['ACTIVE', 'PENDING', 'EXPIRED']).default('ACTIVE'),
  badgeLabel: z.string().optional(),
  bannerImage: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  offerText: z.string().optional(),
});

export const updatePromotionSchema = createPromotionSchema.partial();
