import { z } from 'zod';

export const createBusinessSchema = z.object({
  name: z.string().min(2, { message: 'Business name is required' }),
  categorySlug: z.string().min(2, { message: 'Category slug is required' }),
  subCategory: z.string().default('Local Business'),
  phone: z.string().min(5, { message: 'Phone number is required' }),
  whatsapp: z.string().optional(),
  address: z.string().min(2, { message: 'Address is required' }),
  landmark: z.string().default('Korutla Town'),
  timing: z.string().default('09:00 AM - 09:00 PM'),
  image: z.string().url({ message: 'Valid image URL required' }).or(z.string().min(5)),
  isVerified: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priceRange: z.string().optional(),
  ownerName: z.string().optional(),
});

export const updateBusinessSchema = createBusinessSchema.partial();
