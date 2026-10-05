"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.createJob = exports.getJobById = exports.getJobs = void 0;
const prisma_1 = require("../utils/prisma");
const response_1 = require("../utils/response");
let memoryJobs = [
    {
        id: 'job-1',
        title: 'Sales Executive',
        category: 'Sales',
        shopName: 'Royal Korutla Electronics',
        location: 'Main Road, Korutla',
        salary: '₹12,000 - ₹18,000/month',
        type: 'Full-time',
        experience: '0-2 years',
        phone: '+91 98765 11111',
        whatsapp: '+91 98765 11111',
        postedDate: '2026-10-01',
        description: 'Looking for a dynamic sales executive to manage in-store sales and customer relations.',
        requirements: ['10th pass or above', 'Good communication', 'Telugu fluency'],
        isVerified: true,
        isFeatured: true,
    },
    {
        id: 'job-2',
        title: 'Cook / Chef',
        category: 'Food & Hospitality',
        shopName: 'Royal Paradise Restaurant',
        location: 'Old Bus Stand Area, Korutla',
        salary: '₹10,000 - ₹15,000/month',
        type: 'Full-time',
        experience: '1+ years',
        phone: '+91 98765 22222',
        whatsapp: '+91 98765 22222',
        postedDate: '2026-10-02',
        description: 'Experienced cook needed for a busy multi-cuisine restaurant. Must know South Indian and Biryani preparation.',
        requirements: ['Cooking experience 1+ years', 'Punctual', 'Hygienic practices'],
        isVerified: true,
        isFeatured: false,
    },
    {
        id: 'job-3',
        title: 'Delivery Boy',
        category: 'Delivery & Logistics',
        shopName: 'Korutla Grocery Mart',
        location: 'Korutla Town',
        salary: '₹8,000 - ₹12,000/month',
        type: 'Part-time',
        experience: 'Freshers Welcome',
        phone: '+91 98765 33333',
        whatsapp: '+91 98765 33333',
        postedDate: '2026-10-03',
        description: 'Delivery boy needed for local grocery delivery. Bike required.',
        requirements: ['Bike & License', 'Local area knowledge', 'Age 18-35'],
        isVerified: true,
        isFeatured: false,
    },
];
const getJobs = async (req, res) => {
    try {
        const category = req.query.category;
        const q = req.query.q;
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '50', 10);
        const skip = (page - 1) * limit;
        const where = {};
        if (category && category !== 'all')
            where.category = category;
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { shopName: { contains: q, mode: 'insensitive' } },
                { location: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [jobs, total] = await Promise.all([
            prisma_1.prisma.jobListing.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            prisma_1.prisma.jobListing.count({ where }),
        ]);
        return (0, response_1.sendSuccess)(res, { items: jobs, total, page, limit, totalPages: Math.ceil(total / limit) }, 'Jobs retrieved successfully');
    }
    catch (error) {
        let filtered = memoryJobs;
        const category = req.query.category;
        const q = req.query.q;
        if (category && category !== 'all')
            filtered = filtered.filter((j) => j.category === category);
        if (q) {
            const lower = q.toLowerCase();
            filtered = filtered.filter((j) => j.title.toLowerCase().includes(lower) || j.shopName.toLowerCase().includes(lower));
        }
        return (0, response_1.sendSuccess)(res, { items: filtered, total: filtered.length, page: 1, limit: 50, totalPages: 1 }, 'Jobs retrieved (fallback)');
    }
};
exports.getJobs = getJobs;
const getJobById = async (req, res) => {
    const id = String(req.params.id || '');
    try {
        const job = await prisma_1.prisma.jobListing.findUnique({ where: { id } });
        if (job)
            return (0, response_1.sendSuccess)(res, job, 'Job retrieved');
    }
    catch (_) { }
    const found = memoryJobs.find((j) => j.id === id);
    if (found)
        return (0, response_1.sendSuccess)(res, found, 'Job retrieved (fallback)');
    return (0, response_1.sendError)(res, 'NOT_FOUND', 'Job listing not found', 404);
};
exports.getJobById = getJobById;
const createJob = async (req, res) => {
    const body = req.body;
    try {
        const newJob = await prisma_1.prisma.jobListing.create({
            data: {
                title: String(body.title || ''),
                category: String(body.category || ''),
                shopName: String(body.shopName || ''),
                location: String(body.location || 'Korutla'),
                salary: String(body.salary || ''),
                type: String(body.type || 'Full-time'),
                experience: String(body.experience || 'Freshers Welcome'),
                phone: String(body.phone || ''),
                whatsapp: String(body.whatsapp || body.phone || ''),
                postedDate: String(body.postedDate || new Date().toISOString().split('T')[0]),
                description: String(body.description || ''),
                requirements: Array.isArray(body.requirements) ? body.requirements : [],
                isVerified: body.isVerified ?? true,
                isFeatured: body.isFeatured ?? false,
            },
        });
        memoryJobs.unshift(newJob);
        return (0, response_1.sendSuccess)(res, newJob, 'Job listing created', 201);
    }
    catch (error) {
        const fallback = { id: `job-${Date.now()}`, ...body, isVerified: true, isFeatured: false };
        memoryJobs.unshift(fallback);
        return (0, response_1.sendSuccess)(res, fallback, 'Job listing created (fallback)', 201);
    }
};
exports.createJob = createJob;
const updateJob = async (req, res) => {
    const id = String(req.params.id || '');
    const body = req.body;
    try {
        const updated = await prisma_1.prisma.jobListing.update({ where: { id }, data: body });
        return (0, response_1.sendSuccess)(res, updated, 'Job updated successfully');
    }
    catch (error) {
        const idx = memoryJobs.findIndex((j) => j.id === id);
        if (idx !== -1) {
            memoryJobs[idx] = { ...memoryJobs[idx], ...body };
            return (0, response_1.sendSuccess)(res, memoryJobs[idx], 'Job updated (fallback)');
        }
        return (0, response_1.sendError)(res, 'NOT_FOUND', 'Job not found', 404);
    }
};
exports.updateJob = updateJob;
const deleteJob = async (req, res) => {
    const id = String(req.params.id || '');
    try {
        await prisma_1.prisma.jobListing.delete({ where: { id } });
        memoryJobs = memoryJobs.filter((j) => j.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Job deleted successfully');
    }
    catch (error) {
        memoryJobs = memoryJobs.filter((j) => j.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Job deleted (fallback)');
    }
};
exports.deleteJob = deleteJob;
