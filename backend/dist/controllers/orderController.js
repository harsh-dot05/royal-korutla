"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.createOrder = void 0;
const prisma_1 = require("../utils/prisma");
const response_1 = require("../utils/response");
const createOrder = async (req, res) => {
    try {
        const body = req.body;
        const orderId = `RK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        const order = await prisma_1.prisma.order.create({
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
                    create: (body.items || []).map((item) => ({
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
        return (0, response_1.sendSuccess)(res, order, 'Order logged successfully', 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'SERVER_ERROR', 'Failed to process order log', 500);
    }
};
exports.createOrder = createOrder;
const getOrders = async (req, res) => {
    try {
        const orders = await prisma_1.prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
        return (0, response_1.sendSuccess)(res, orders, 'Orders list retrieved');
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'SERVER_ERROR', 'Failed to fetch orders', 500);
    }
};
exports.getOrders = getOrders;
