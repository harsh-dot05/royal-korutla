import { z } from 'zod';

export const createPhotographySchema = z.object({
  name: z.string().min(2, { message: 'Studio name is required' }),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
  location: z.string().default('Main Road, Korutla'),
  landmark: z.string().optional(),
  phone: z.string().min(5, { message: 'Phone number is required' }),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  description: z.string().optional(),
  photographyTypes: z.array(z.string()).default(['Wedding', 'Events']),
  startingPrice: z.string().optional(),
  openingHours: z.string().default('09:00 AM - 09:00 PM'),
  isVerified: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  galleryImages: z.array(z.string()).optional(),
});

export const updatePhotographySchema = createPhotographySchema.partial();
