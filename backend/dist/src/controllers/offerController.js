"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOffer = exports.createOffer = exports.getOffers = void 0;
const prisma_1 = require("../utils/prisma");
const response_1 = require("../utils/response");
let memoryOffers = [
    {
        id: 'offer-1',
        title: 'Flat 20% Off on Biryani & Starters',
        businessName: 'Royal Paradise Restaurant',
        discount: '20% OFF',
        code: 'ROYAL20',
        expiry: '2026-12-31',
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&auto=format&fit=crop&q=80',
        tag: 'Food',
        categorySlug: 'food',
        location: 'Main Road, Korutla',
    },
    {
        id: 'offer-2',
        title: 'Buy 2 Get 1 Free on Sarees',
        businessName: 'Sri Laxmi Textiles',
        discount: 'Buy 2 Get 1',
        code: 'TEXTILE3',
        expiry: '2026-11-30',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
        tag: 'Shopping',
        categorySlug: 'shopping',
        location: 'Cloth Market Road, Korutla',
    },
    {
        id: 'offer-3',
        title: '₹500 Off on First Photography Booking',
        businessName: 'Korutla Foto Studio',
        discount: '₹500 OFF',
        code: 'PHOTO500',
        expiry: '2026-11-15',
        image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop&q=80',
        tag: 'Photography',
        categorySlug: 'photography',
        location: 'Main Road, Korutla',
    },
];
const getOffers = async (req, res) => {
    try {
        const categorySlug = req.query.categorySlug;
        const where = {};
        if (categorySlug && categorySlug !== 'all')
            where.categorySlug = categorySlug;
        const offers = await prisma_1.prisma.offer.findMany({ where, take: 20, orderBy: { createdAt: 'desc' } });
        return (0, response_1.sendSuccess)(res, offers, 'Offers retrieved successfully');
    }
    catch (error) {
        let filtered = memoryOffers;
        const categorySlug = req.query.categorySlug;
        if (categorySlug && categorySlug !== 'all')
            filtered = filtered.filter((o) => o.categorySlug === categorySlug);
        return (0, response_1.sendSuccess)(res, filtered, 'Offers retrieved (fallback)');
    }
};
exports.getOffers = getOffers;
const createOffer = async (req, res) => {
    const body = req.body;
    try {
        const newOffer = await prisma_1.prisma.offer.create({
            data: {
                title: String(body.title || ''),
                businessName: String(body.businessName || ''),
                discount: String(body.discount || ''),
                code: body.code ? String(body.code) : undefined,
                expiry: String(body.expiry || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]),
                image: String(body.image || 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&auto=format&fit=crop&q=80'),
                tag: String(body.tag || 'Offer'),
                categorySlug: String(body.categorySlug || 'businesses'),
                location: String(body.location || 'Korutla'),
            },
        });
        memoryOffers.unshift(newOffer);
        return (0, response_1.sendSuccess)(res, newOffer, 'Offer created successfully', 201);
    }
    catch (error) {
        const fallback = { id: `offer-${Date.now()}`, ...body };
        memoryOffers.unshift(fallback);
        return (0, response_1.sendSuccess)(res, fallback, 'Offer created (fallback)', 201);
    }
};
exports.createOffer = createOffer;
const deleteOffer = async (req, res) => {
    const id = String(req.params.id || '');
    try {
        await prisma_1.prisma.offer.delete({ where: { id } });
        memoryOffers = memoryOffers.filter((o) => o.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Offer deleted successfully');
    }
    catch (error) {
        memoryOffers = memoryOffers.filter((o) => o.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Offer deleted (fallback)');
    }
};
exports.deleteOffer = deleteOffer;
