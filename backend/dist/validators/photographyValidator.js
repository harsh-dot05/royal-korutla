"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePhotographySchema = exports.createPhotographySchema = void 0;
const zod_1 = require("zod");
exports.createPhotographySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: 'Studio name is required' }),
    profileImage: zod_1.z.string().optional(),
    coverImage: zod_1.z.string().optional(),
    location: zod_1.z.string().default('Main Road, Korutla'),
    landmark: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(5, { message: 'Phone number is required' }),
    whatsapp: zod_1.z.string().optional(),
    instagram: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    photographyTypes: zod_1.z.array(zod_1.z.string()).default(['Wedding', 'Events']),
    startingPrice: zod_1.z.string().optional(),
    openingHours: zod_1.z.string().default('09:00 AM - 09:00 PM'),
    isVerified: zod_1.z.boolean().default(true),
    isFeatured: zod_1.z.boolean().default(false),
    galleryImages: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updatePhotographySchema = exports.createPhotographySchema.partial();
