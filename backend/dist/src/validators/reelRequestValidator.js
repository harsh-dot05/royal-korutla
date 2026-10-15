"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReelRequestSchema = exports.createReelRequestSchema = void 0;
const zod_1 = require("zod");
exports.createReelRequestSchema = zod_1.z.object({
    businessName: zod_1.z.string().min(2, 'Business name must be at least 2 characters'),
    contactPhone: zod_1.z.string().min(10, 'Contact number must be at least 10 digits'),
    businessCategory: zod_1.z.string().min(2, 'Category is required'),
    reelPurpose: zod_1.z.enum([
        'product_promotion',
        'offer',
        'shop_introduction',
        'event',
        'other',
    ]).default('product_promotion'),
    preferredLanguage: zod_1.z.enum(['Telugu', 'English']).default('Telugu'),
    additionalRequirements: zod_1.z.string().optional().default(''),
});
exports.updateReelRequestSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'CONTACTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
    adminNotes: zod_1.z.string().optional(),
    followUpDate: zod_1.z.string().optional(),
});
