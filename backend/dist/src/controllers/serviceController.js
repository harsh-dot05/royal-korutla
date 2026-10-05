"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceRequests = exports.createServiceRequest = exports.deleteServiceProvider = exports.updateServiceProvider = exports.createServiceProvider = exports.getServiceProviders = void 0;
const prisma_1 = require("../utils/prisma");
const response_1 = require("../utils/response");
let memoryProviders = [
    {
        id: 'svc-1',
        name: 'Ramesh Electricals & Services',
        serviceCategory: 'Electrician',
        subCategory: 'Wiring & Installation',
        area: 'All Korutla Areas',
        rating: 4.9,
        reviewCount: 87,
        experienceYears: 12,
        startingPrice: '₹300/visit',
        phone: '+91 98765 77777',
        whatsapp: '+91 98765 77777',
        timing: '08:00 AM - 09:00 PM',
        isVerified: true,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&auto=format&fit=crop&q=80',
        description: 'Expert electrician for all types of household and commercial wiring, board installation, motor repair, and inverter servicing.',
        servicesOffered: ['House Wiring', 'Board Repair', 'Motor Installation', 'Inverter Service', 'AC Wiring'],
    },
    {
        id: 'svc-2',
        name: 'Korutla Plumbing & Sanitation Works',
        serviceCategory: 'Plumber',
        subCategory: 'Plumbing & Sanitation',
        area: 'Korutla Town & Surrounding Villages',
        rating: 4.7,
        reviewCount: 53,
        experienceYears: 8,
        startingPrice: '₹250/visit',
        phone: '+91 94400 88888',
        whatsapp: '+91 94400 88888',
        timing: '07:00 AM - 08:00 PM',
        isVerified: true,
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80',
        description: 'All types of plumbing work including pipe laying, tap fixing, overhead tank installation, and bathroom fitting.',
        servicesOffered: ['Pipe Repair', 'Tap Fixing', 'Tank Cleaning', 'Bathroom Fitting', 'Drainage Work'],
    },
    {
        id: 'svc-3',
        name: 'CoolAir AC Service Center',
        serviceCategory: 'AC Repair',
        subCategory: 'Air Conditioning',
        area: 'Korutla & Metpally',
        rating: 4.8,
        reviewCount: 145,
        experienceYears: 10,
        startingPrice: '₹500/service',
        phone: '+91 98480 99999',
        whatsapp: '+91 98480 99999',
        timing: '09:00 AM - 07:00 PM',
        isVerified: true,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1631545806609-aa85ed30c3c4?w=600&auto=format&fit=crop&q=80',
        description: 'Authorized AC service for all brands. Gas filling, filter cleaning, installation and repair for split and window AC units.',
        servicesOffered: ['Gas Filling', 'Filter Cleaning', 'Installation', 'Repair', 'Annual Maintenance'],
    },
];
let memoryServiceRequests = [];
const getServiceProviders = async (req, res) => {
    try {
        const category = req.query.category;
        const q = req.query.q;
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '50', 10);
        const skip = (page - 1) * limit;
        const where = {};
        if (category && category !== 'all')
            where.serviceCategory = category;
        if (q) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { serviceCategory: { contains: q, mode: 'insensitive' } },
                { area: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [providers, total] = await Promise.all([
            prisma_1.prisma.serviceProvider.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            prisma_1.prisma.serviceProvider.count({ where }),
        ]);
        return (0, response_1.sendSuccess)(res, { items: providers, total, page, limit, totalPages: Math.ceil(total / limit) }, 'Service providers retrieved');
    }
    catch (error) {
        let filtered = memoryProviders;
        const category = req.query.category;
        const q = req.query.q;
        if (category && category !== 'all')
            filtered = filtered.filter((p) => p.serviceCategory === category);
        if (q) {
            const lower = q.toLowerCase();
            filtered = filtered.filter((p) => p.name.toLowerCase().includes(lower) || p.serviceCategory.toLowerCase().includes(lower));
        }
        return (0, response_1.sendSuccess)(res, { items: filtered, total: filtered.length, page: 1, limit: 50, totalPages: 1 }, 'Service providers retrieved (fallback)');
    }
};
exports.getServiceProviders = getServiceProviders;
const createServiceProvider = async (req, res) => {
    const body = req.body;
    try {
        const newProvider = await prisma_1.prisma.serviceProvider.create({
            data: {
                name: String(body.name || ''),
                serviceCategory: String(body.serviceCategory || ''),
                subCategory: body.subCategory ? String(body.subCategory) : undefined,
                area: String(body.area || 'Korutla'),
                rating: Number(body.rating) || 4.8,
                reviewCount: Number(body.reviewCount) || 1,
                experienceYears: body.experienceYears !== undefined ? Number(body.experienceYears) : undefined,
                startingPrice: body.startingPrice ? String(body.startingPrice) : undefined,
                phone: String(body.phone || ''),
                whatsapp: body.whatsapp ? String(body.whatsapp) : String(body.phone || ''),
                timing: String(body.timing || '09:00 AM - 07:00 PM'),
                isVerified: body.isVerified ?? true,
                isFeatured: body.isFeatured ?? false,
                image: String(body.image || 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&auto=format&fit=crop&q=80'),
                description: String(body.description || ''),
                servicesOffered: Array.isArray(body.servicesOffered) ? body.servicesOffered : [],
            },
        });
        memoryProviders.unshift(newProvider);
        return (0, response_1.sendSuccess)(res, newProvider, 'Service provider created successfully', 201);
    }
    catch (error) {
        const fallback = { id: `svc-${Date.now()}`, ...body, isVerified: true, isFeatured: false };
        memoryProviders.unshift(fallback);
        return (0, response_1.sendSuccess)(res, fallback, 'Service provider created (fallback)', 201);
    }
};
exports.createServiceProvider = createServiceProvider;
const updateServiceProvider = async (req, res) => {
    const id = String(req.params.id || '');
    const body = req.body;
    try {
        const updated = await prisma_1.prisma.serviceProvider.update({ where: { id }, data: body });
        return (0, response_1.sendSuccess)(res, updated, 'Service provider updated successfully');
    }
    catch (error) {
        const idx = memoryProviders.findIndex((p) => p.id === id);
        if (idx !== -1) {
            memoryProviders[idx] = { ...memoryProviders[idx], ...body };
            return (0, response_1.sendSuccess)(res, memoryProviders[idx], 'Service provider updated (fallback)');
        }
        return (0, response_1.sendError)(res, 'NOT_FOUND', 'Service provider not found', 404);
    }
};
exports.updateServiceProvider = updateServiceProvider;
const deleteServiceProvider = async (req, res) => {
    const id = String(req.params.id || '');
    try {
        await prisma_1.prisma.serviceProvider.delete({ where: { id } });
        memoryProviders = memoryProviders.filter((p) => p.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Service provider deleted successfully');
    }
    catch (error) {
        memoryProviders = memoryProviders.filter((p) => p.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Service provider deleted (fallback)');
    }
};
exports.deleteServiceProvider = deleteServiceProvider;
const createServiceRequest = async (req, res) => {
    const body = req.body;
    try {
        const newRequest = await prisma_1.prisma.serviceRequest.create({
            data: {
                customerName: body.customerName,
                customerPhone: body.customerPhone,
                serviceCategory: body.serviceCategory,
                providerName: body.providerName,
                address: body.address,
                preferredTime: body.preferredTime,
                message: body.message,
                status: 'PENDING',
            },
        });
        return (0, response_1.sendSuccess)(res, newRequest, 'Service request submitted successfully', 201);
    }
    catch (error) {
        const fallback = { id: `req-${Date.now()}`, ...body, status: 'PENDING', createdAt: new Date().toISOString() };
        memoryServiceRequests.unshift(fallback);
        return (0, response_1.sendSuccess)(res, fallback, 'Service request submitted (fallback)', 201);
    }
};
exports.createServiceRequest = createServiceRequest;
const getServiceRequests = async (req, res) => {
    try {
        const requests = await prisma_1.prisma.serviceRequest.findMany({ orderBy: { createdAt: 'desc' } });
        return (0, response_1.sendSuccess)(res, requests, 'Service requests retrieved');
    }
    catch (error) {
        return (0, response_1.sendSuccess)(res, memoryServiceRequests, 'Service requests retrieved (fallback)');
    }
};
exports.getServiceRequests = getServiceRequests;
