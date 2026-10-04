"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromotion = exports.createPromotion = exports.getAllPromotions = exports.getActivePromotions = void 0;
const prisma_1 = require("../utils/prisma");
const response_1 = require("../utils/response");
const seedData_1 = require("../utils/seedData");
let memoryPromotions = [...seedData_1.INITIAL_PROMOTIONS];
const getActivePromotions = async (req, res) => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const promotions = await prisma_1.prisma.promotion.findMany({
            where: {
                status: 'ACTIVE',
                endDate: { gte: todayStr },
            },
            orderBy: { priority: 'asc' },
        });
        return (0, response_1.sendSuccess)(res, promotions, 'Active promotions retrieved successfully');
    }
    catch (error) {
        return (0, response_1.sendSuccess)(res, memoryPromotions.filter((p) => p.status === 'ACTIVE'), 'Active promotions retrieved successfully (fallback)');
    }
};
exports.getActivePromotions = getActivePromotions;
const getAllPromotions = async (req, res) => {
    try {
        const promotions = await prisma_1.prisma.promotion.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return (0, response_1.sendSuccess)(res, promotions, 'Admin promotions list retrieved');
    }
    catch (error) {
        return (0, response_1.sendSuccess)(res, memoryPromotions, 'Admin promotions list retrieved (fallback)');
    }
};
exports.getAllPromotions = getAllPromotions;
const createPromotion = async (req, res) => {
    const body = req.body;
    try {
        const newPromotion = await prisma_1.prisma.promotion.create({
            data: {
                businessId: body.businessId,
                businessName: body.businessName,
                promotionType: body.promotionType || 'HOMEPAGE_FEATURED',
                placement: body.placement || 'Homepage Top Banner',
                startDate: body.startDate || new Date().toISOString().split('T')[0],
                endDate: body.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                priority: body.priority || 1,
                status: body.status || 'ACTIVE',
                badgeLabel: body.badgeLabel || 'PROMOTED',
                bannerImage: body.bannerImage,
                title: body.title,
                description: body.description,
                offerText: body.offerText,
            },
        });
        memoryPromotions.unshift(newPromotion);
        return (0, response_1.sendSuccess)(res, newPromotion, 'Promotion created and published successfully', 201);
    }
    catch (error) {
        const fallbackPromotion = {
            id: `prom-${Date.now()}`,
            ...body,
            status: body.status || 'ACTIVE',
        };
        memoryPromotions.unshift(fallbackPromotion);
        return (0, response_1.sendSuccess)(res, fallbackPromotion, 'Promotion created and published successfully (fallback)', 201);
    }
};
exports.createPromotion = createPromotion;
const deletePromotion = async (req, res) => {
    const rawId = req.query.id || req.params.id;
    const id = String(rawId || '');
    try {
        await prisma_1.prisma.promotion.delete({ where: { id } });
        memoryPromotions = memoryPromotions.filter((p) => p.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Promotion deleted successfully');
    }
    catch (error) {
        memoryPromotions = memoryPromotions.filter((p) => p.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Promotion deleted successfully (fallback)');
    }
};
exports.deletePromotion = deletePromotion;
