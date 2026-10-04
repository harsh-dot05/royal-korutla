import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().email({ message: 'Valid email address is required' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters' }),
});
