"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(2, { message: 'Customer name is required' }),
    customerPhone: zod_1.z.string().min(5, { message: 'Customer phone number is required' }),
    deliveryAddress: zod_1.z.string().min(2, { message: 'Delivery address is required' }),
    landmark: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    totalAmount: zod_1.z.number().min(0),
    items: zod_1.z.array(zod_1.z.object({
        foodItemId: zod_1.z.string().optional(),
        name: zod_1.z.string(),
        price: zod_1.z.number(),
        quantity: zod_1.z.number().min(1),
        businessName: zod_1.z.string().optional(),
    })).min(1, { message: 'Order must contain at least one item' }),
});
