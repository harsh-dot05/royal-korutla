"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBusiness = exports.updateBusiness = exports.createBusiness = exports.getBusinessById = exports.getBusinesses = void 0;
const prisma_1 = require("../utils/prisma");
const response_1 = require("../utils/response");
const seedData_1 = require("../utils/seedData");
let memoryBusinesses = [...seedData_1.INITIAL_BUSINESSES];
const getBusinesses = async (req, res) => {
    try {
        const category = req.query.category;
        const q = req.query.q;
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '50', 10);
        const skip = (page - 1) * limit;
        const where = {};
        if (category && category !== 'all') {
            where.categorySlug = category;
        }
        if (q) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { address: { contains: q, mode: 'insensitive' } },
                { subCategory: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [businesses, total] = await Promise.all([
            prisma_1.prisma.business.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.business.count({ where }),
        ]);
        return (0, response_1.sendSuccess)(res, {
            items: businesses,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }, 'Businesses retrieved successfully');
    }
    catch (error) {
        let filtered = memoryBusinesses;
        const category = req.query.category;
        const q = req.query.q;
        if (category && category !== 'all') {
            filtered = filtered.filter((b) => b.categorySlug === category);
        }
        if (q) {
            const lower = q.toLowerCase();
            filtered = filtered.filter((b) => b.name.toLowerCase().includes(lower) ||
                b.address.toLowerCase().includes(lower) ||
                b.subCategory.toLowerCase().includes(lower));
        }
        return (0, response_1.sendSuccess)(res, {
            items: filtered,
            total: filtered.length,
            page: 1,
            limit: 50,
            totalPages: 1,
        }, 'Businesses retrieved successfully (fallback)');
    }
};
exports.getBusinesses = getBusinesses;
const getBusinessById = async (req, res) => {
    const id = req.params.id;
    try {
        const business = await prisma_1.prisma.business.findUnique({
            where: { id },
            include: {
                galleryImages: true,
                tags: true,
                reviews: true,
            },
        });
        if (business) {
            return (0, response_1.sendSuccess)(res, business, 'Business detail retrieved');
        }
    }
    catch (error) {
        // fallback
    }
    const found = memoryBusinesses.find((b) => b.id === id);
    if (found) {
        return (0, response_1.sendSuccess)(res, found, 'Business detail retrieved (fallback)');
    }
    return (0, response_1.sendSuccess)(res, null, 'Business not found', 404);
};
exports.getBusinessById = getBusinessById;
const createBusiness = async (req, res) => {
    const body = req.body;
    try {
        const newBusiness = await prisma_1.prisma.business.create({
            data: {
                name: body.name,
                categorySlug: body.categorySlug,
                subCategory: body.subCategory || 'Local Business',
                phone: body.phone,
                whatsapp: body.whatsapp || body.phone,
                address: body.address,
                landmark: body.landmark || 'Korutla Town',
                timing: body.timing || '09:00 AM - 09:00 PM',
                image: body.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
                isVerified: body.isVerified ?? true,
                isFeatured: body.isFeatured ?? false,
                description: body.description,
                priceRange: body.priceRange,
                ownerName: body.ownerName,
            },
        });
        memoryBusinesses.unshift(newBusiness);
        return (0, response_1.sendSuccess)(res, newBusiness, 'Business created successfully', 201);
    }
    catch (error) {
        const fallbackBiz = {
            id: `biz-${Date.now()}`,
            ...body,
            isVerified: body.isVerified ?? true,
            isFeatured: body.isFeatured ?? false,
        };
        memoryBusinesses.unshift(fallbackBiz);
        return (0, response_1.sendSuccess)(res, fallbackBiz, 'Business created successfully (fallback)', 201);
    }
};
exports.createBusiness = createBusiness;
const updateBusiness = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const updated = await prisma_1.prisma.business.update({
            where: { id },
            data: body,
        });
        return (0, response_1.sendSuccess)(res, updated, 'Business updated successfully');
    }
    catch (error) {
        const idx = memoryBusinesses.findIndex((b) => b.id === id);
        if (idx !== -1) {
            memoryBusinesses[idx] = { ...memoryBusinesses[idx], ...body };
            return (0, response_1.sendSuccess)(res, memoryBusinesses[idx], 'Business updated successfully (fallback)');
        }
        return (0, response_1.sendSuccess)(res, null, 'Business not found', 404);
    }
};
exports.updateBusiness = updateBusiness;
const deleteBusiness = async (req, res) => {
    const id = req.params.id;
    try {
        await prisma_1.prisma.business.delete({ where: { id } });
        memoryBusinesses = memoryBusinesses.filter((b) => b.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Business deleted successfully');
    }
    catch (error) {
        memoryBusinesses = memoryBusinesses.filter((b) => b.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Business deleted successfully (fallback)');
    }
};
exports.deleteBusiness = deleteBusiness;
