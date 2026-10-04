"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePromotionSchema = exports.createPromotionSchema = void 0;
const zod_1 = require("zod");
exports.createPromotionSchema = zod_1.z.object({
    businessId: zod_1.z.string().optional(),
    businessName: zod_1.z.string().min(2, { message: 'Business name is required' }),
    promotionType: zod_1.z.enum([
        'FEATURED_BUSINESS',
        'HOMEPAGE_FEATURED',
        'CATEGORY_FEATURED',
        'SPONSORED_OFFER',
        'FESTIVAL_CAMPAIGN',
        'BUSINESS_OF_THE_WEEK',
    ]).default('HOMEPAGE_FEATURED'),
    placement: zod_1.z.string().default('Homepage Top Banner'),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    priority: zod_1.z.number().default(1),
    status: zod_1.z.enum(['ACTIVE', 'PENDING', 'EXPIRED']).default('ACTIVE'),
    badgeLabel: zod_1.z.string().optional(),
    bannerImage: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    offerText: zod_1.z.string().optional(),
});
exports.updatePromotionSchema = exports.createPromotionSchema.partial();
