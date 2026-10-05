"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getPropertyById = exports.getProperties = void 0;
const prisma_1 = require("../utils/prisma");
const response_1 = require("../utils/response");
let memoryProperties = [
    {
        id: 'prop-1',
        title: '3 BHK House for Rent near Market',
        type: 'Rent',
        category: 'House',
        price: '₹8,000/month',
        pricePerSqft: null,
        areaSqft: 1200,
        location: 'Market Road, Korutla',
        bedrooms: 3,
        bathrooms: 2,
        features: ['Bore water', 'Parking', 'Ground floor', 'Near school'],
        ownerName: 'Ravi Kumar',
        ownerPhone: '+91 98765 44444',
        whatsapp: '+91 98765 44444',
        postedDate: '2026-09-25',
        isVerified: true,
        isFeatured: true,
        images: [],
    },
    {
        id: 'prop-2',
        title: 'Commercial Shop for Lease - Main Road',
        type: 'Lease',
        category: 'Commercial',
        price: '₹15,000/month',
        pricePerSqft: '₹250',
        areaSqft: 600,
        location: 'Main Road, Near Gandhi Statue, Korutla',
        bedrooms: null,
        bathrooms: 1,
        features: ['Ground floor', 'Road facing', 'High footfall area', 'Power supply 3-phase'],
        ownerName: 'Suresh Reddy',
        ownerPhone: '+91 94400 55555',
        whatsapp: '+91 94400 55555',
        postedDate: '2026-10-01',
        isVerified: true,
        isFeatured: false,
        images: [],
    },
    {
        id: 'prop-3',
        title: '150 Sq Yd Residential Plot for Sale',
        type: 'Buy',
        category: 'Plot',
        price: '₹12 Lakhs',
        pricePerSqft: '₹800',
        areaSqft: 1350,
        location: 'Srinagar Colony, Korutla',
        bedrooms: null,
        bathrooms: null,
        features: ['Corner plot', 'DTCP approved', 'Road facing', 'Clear title'],
        ownerName: 'Naresh Goud',
        ownerPhone: '+91 98480 66666',
        whatsapp: '+91 98480 66666',
        postedDate: '2026-09-28',
        isVerified: true,
        isFeatured: true,
        images: [],
    },
];
const getProperties = async (req, res) => {
    try {
        const type = req.query.type;
        const category = req.query.category;
        const q = req.query.q;
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '50', 10);
        const skip = (page - 1) * limit;
        const where = {};
        if (type && type !== 'all')
            where.type = type;
        if (category && category !== 'all')
            where.category = category;
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { location: { contains: q, mode: 'insensitive' } },
                { ownerName: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [properties, total] = await Promise.all([
            prisma_1.prisma.realEstateProperty.findMany({ where, skip, take: limit, include: { images: true }, orderBy: { createdAt: 'desc' } }),
            prisma_1.prisma.realEstateProperty.count({ where }),
        ]);
        return (0, response_1.sendSuccess)(res, { items: properties, total, page, limit, totalPages: Math.ceil(total / limit) }, 'Properties retrieved successfully');
    }
    catch (error) {
        let filtered = memoryProperties;
        const type = req.query.type;
        const q = req.query.q;
        if (type && type !== 'all')
            filtered = filtered.filter((p) => p.type === type);
        if (q) {
            const lower = q.toLowerCase();
            filtered = filtered.filter((p) => p.title.toLowerCase().includes(lower) || p.location.toLowerCase().includes(lower));
        }
        return (0, response_1.sendSuccess)(res, { items: filtered, total: filtered.length, page: 1, limit: 50, totalPages: 1 }, 'Properties retrieved (fallback)');
    }
};
exports.getProperties = getProperties;
const getPropertyById = async (req, res) => {
    const id = String(req.params.id || '');
    try {
        const property = await prisma_1.prisma.realEstateProperty.findUnique({ where: { id }, include: { images: true } });
        if (property)
            return (0, response_1.sendSuccess)(res, property, 'Property retrieved');
    }
    catch (_) { }
    const found = memoryProperties.find((p) => p.id === id);
    if (found)
        return (0, response_1.sendSuccess)(res, found, 'Property retrieved (fallback)');
    return (0, response_1.sendError)(res, 'NOT_FOUND', 'Property not found', 404);
};
exports.getPropertyById = getPropertyById;
const createProperty = async (req, res) => {
    const body = req.body;
    try {
        const newProperty = await prisma_1.prisma.realEstateProperty.create({
            data: {
                title: String(body.title || ''),
                type: String(body.type || ''),
                category: String(body.category || ''),
                price: String(body.price || ''),
                pricePerSqft: body.pricePerSqft ? String(body.pricePerSqft) : undefined,
                areaSqft: Number(body.areaSqft) || 0,
                location: String(body.location || ''),
                bedrooms: body.bedrooms !== undefined ? Number(body.bedrooms) : undefined,
                bathrooms: body.bathrooms !== undefined ? Number(body.bathrooms) : undefined,
                features: Array.isArray(body.features) ? body.features : [],
                ownerName: String(body.ownerName || ''),
                ownerPhone: String(body.ownerPhone || ''),
                whatsapp: body.whatsapp ? String(body.whatsapp) : String(body.ownerPhone || ''),
                postedDate: String(body.postedDate || new Date().toISOString().split('T')[0]),
                isVerified: body.isVerified ?? true,
                isFeatured: body.isFeatured ?? false,
            },
        });
        memoryProperties.unshift(newProperty);
        return (0, response_1.sendSuccess)(res, newProperty, 'Property created successfully', 201);
    }
    catch (error) {
        const fallback = { id: `prop-${Date.now()}`, ...body, isVerified: true, isFeatured: false, images: [] };
        memoryProperties.unshift(fallback);
        return (0, response_1.sendSuccess)(res, fallback, 'Property created (fallback)', 201);
    }
};
exports.createProperty = createProperty;
const updateProperty = async (req, res) => {
    const id = String(req.params.id || '');
    const body = req.body;
    try {
        const updated = await prisma_1.prisma.realEstateProperty.update({ where: { id }, data: body });
        return (0, response_1.sendSuccess)(res, updated, 'Property updated successfully');
    }
    catch (error) {
        const idx = memoryProperties.findIndex((p) => p.id === id);
        if (idx !== -1) {
            memoryProperties[idx] = { ...memoryProperties[idx], ...body };
            return (0, response_1.sendSuccess)(res, memoryProperties[idx], 'Property updated (fallback)');
        }
        return (0, response_1.sendError)(res, 'NOT_FOUND', 'Property not found', 404);
    }
};
exports.updateProperty = updateProperty;
const deleteProperty = async (req, res) => {
    const id = String(req.params.id || '');
    try {
        await prisma_1.prisma.realEstateProperty.delete({ where: { id } });
        memoryProperties = memoryProperties.filter((p) => p.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Property deleted successfully');
    }
    catch (error) {
        memoryProperties = memoryProperties.filter((p) => p.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Property deleted (fallback)');
    }
};
exports.deleteProperty = deleteProperty;
