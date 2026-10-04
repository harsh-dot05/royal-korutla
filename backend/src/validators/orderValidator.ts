import { z } from 'zod';

export const createOrderSchema = z.object({
  customerName: z.string().min(2, { message: 'Customer name is required' }),
  customerPhone: z.string().min(5, { message: 'Customer phone number is required' }),
  deliveryAddress: z.string().min(2, { message: 'Delivery address is required' }),
  landmark: z.string().optional(),
  notes: z.string().optional(),
  totalAmount: z.number().min(0),
  items: z.array(
    z.object({
      foodItemId: z.string().optional(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().min(1),
      businessName: z.string().optional(),
    })
  ).min(1, { message: 'Order must contain at least one item' }),
});
