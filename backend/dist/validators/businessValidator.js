"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBusinessSchema = exports.createBusinessSchema = void 0;
const zod_1 = require("zod");
exports.createBusinessSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: 'Business name is required' }),
    categorySlug: zod_1.z.string().min(2, { message: 'Category slug is required' }),
    subCategory: zod_1.z.string().default('Local Business'),
    phone: zod_1.z.string().min(5, { message: 'Phone number is required' }),
    whatsapp: zod_1.z.string().optional(),
    address: zod_1.z.string().min(2, { message: 'Address is required' }),
    landmark: zod_1.z.string().default('Korutla Town'),
    timing: zod_1.z.string().default('09:00 AM - 09:00 PM'),
    image: zod_1.z.string().url({ message: 'Valid image URL required' }).or(zod_1.z.string().min(5)),
    isVerified: zod_1.z.boolean().default(true),
    isFeatured: zod_1.z.boolean().default(false),
    description: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    priceRange: zod_1.z.string().optional(),
    ownerName: zod_1.z.string().optional(),
});
exports.updateBusinessSchema = exports.createBusinessSchema.partial();
