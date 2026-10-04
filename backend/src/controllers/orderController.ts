import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const orderId = `RK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await prisma.order.create({
      data: {
        id: orderId,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        deliveryAddress: body.deliveryAddress,
        landmark: body.landmark,
        notes: body.notes,
        totalAmount: body.totalAmount,
        status: 'WHATSAPP_DISPATCHED',
        items: {
          create: (body.items || []).map((item: any) => ({
            foodItemId: item.foodItemId || `item-${Date.now()}`,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            businessName: item.businessName || 'Royal Korutla Merchant',
          })),
        },
      },
      include: { items: true },
    });

    return sendSuccess(res, order, 'Order logged successfully', 201);
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', 'Failed to process order log', 500);
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, orders, 'Orders list retrieved');
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', 'Failed to fetch orders', 500);
  }
};
