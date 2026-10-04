"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomepagePayload = void 0;
const prisma_1 = require("../utils/prisma");
const response_1 = require("../utils/response");
const getHomepagePayload = async (req, res) => {
    try {
        const [slider, categories, featuredBusinesses, offers, emergencyContacts] = await Promise.all([
            prisma_1.prisma.heroSlide.findMany({ orderBy: { priority: 'asc' } }).catch(() => []),
            prisma_1.prisma.category.findMany({ orderBy: { name: 'asc' } }).catch(() => []),
            prisma_1.prisma.business.findMany({ where: { isFeatured: true }, take: 10 }).catch(() => []),
            prisma_1.prisma.offer.findMany({ take: 6 }).catch(() => []),
            prisma_1.prisma.emergencyContact.findMany().catch(() => []),
        ]);
        return (0, response_1.sendSuccess)(res, {
            slider,
            categories,
            featuredBusinesses,
            offers,
            emergencyContacts,
        }, 'Royal Korutla Homepage Payload');
    }
    catch (error) {
        return (0, response_1.sendSuccess)(res, {}, 'Royal Korutla Homepage Payload');
    }
};
exports.getHomepagePayload = getHomepagePayload;
