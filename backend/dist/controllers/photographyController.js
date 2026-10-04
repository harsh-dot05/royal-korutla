"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePhotographyStudio = exports.updatePhotographyStudio = exports.createPhotographyStudio = exports.getPhotographyStudios = void 0;
const prisma_1 = require("../utils/prisma");
const response_1 = require("../utils/response");
const seedData_1 = require("../utils/seedData");
let memoryStudios = [...seedData_1.INITIAL_PHOTOGRAPHY_STUDIOS];
const getPhotographyStudios = async (req, res) => {
    try {
        const type = req.query.type;
        const q = req.query.q;
        const where = {};
        if (q) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { location: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        }
        let studios = await prisma_1.prisma.photographyBusiness.findMany({
            where,
            include: { galleryImages: true },
            orderBy: { createdAt: 'desc' },
        });
        if (type && type !== 'All') {
            studios = studios.filter((s) => s.photographyTypes.includes(type));
        }
        return (0, response_1.sendSuccess)(res, studios, 'Photography listings retrieved');
    }
    catch (error) {
        let filtered = memoryStudios;
        const type = req.query.type;
        const q = req.query.q;
        if (type && type !== 'All') {
            filtered = filtered.filter((s) => s.photographyTypes.includes(type));
        }
        if (q) {
            const lower = q.toLowerCase();
            filtered = filtered.filter((s) => s.name.toLowerCase().includes(lower) ||
                s.location.toLowerCase().includes(lower) ||
                s.description.toLowerCase().includes(lower));
        }
        return (0, response_1.sendSuccess)(res, filtered, 'Photography listings retrieved (fallback)');
    }
};
exports.getPhotographyStudios = getPhotographyStudios;
const createPhotographyStudio = async (req, res) => {
    const body = req.body;
    try {
        const newStudio = await prisma_1.prisma.photographyBusiness.create({
            data: {
                name: body.name,
                profileImage: body.profileImage || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop&q=80',
                coverImage: body.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
                location: body.location || 'Main Road, Korutla',
                landmark: body.landmark || 'Near Gandhi Statue',
                phone: body.phone,
                whatsapp: body.whatsapp || body.phone,
                instagram: body.instagram || '@korutlaphotography',
                description: body.description || 'Professional photo studio in Korutla.',
                photographyTypes: body.photographyTypes || ['Wedding', 'Portrait', 'Events'],
                startingPrice: body.startingPrice || '₹15,000 / day',
                openingHours: body.openingHours || '09:00 AM - 09:00 PM',
                isVerified: body.isVerified ?? true,
                isFeatured: body.isFeatured ?? false,
            },
        });
        memoryStudios.unshift(newStudio);
        return (0, response_1.sendSuccess)(res, newStudio, 'Photography studio created successfully', 201);
    }
    catch (error) {
        const fallbackStudio = {
            id: `photo-${Date.now()}`,
            ...body,
            isVerified: body.isVerified ?? true,
            isFeatured: body.isFeatured ?? false,
            galleryImages: [],
        };
        memoryStudios.unshift(fallbackStudio);
        return (0, response_1.sendSuccess)(res, fallbackStudio, 'Photography studio created successfully (fallback)', 201);
    }
};
exports.createPhotographyStudio = createPhotographyStudio;
const updatePhotographyStudio = async (req, res) => {
    const rawId = req.body.id || req.params.id;
    const id = String(rawId || '');
    try {
        const updated = await prisma_1.prisma.photographyBusiness.update({
            where: { id },
            data: req.body,
        });
        return (0, response_1.sendSuccess)(res, updated, 'Photography studio updated successfully');
    }
    catch (error) {
        const idx = memoryStudios.findIndex((s) => s.id === id);
        if (idx !== -1) {
            memoryStudios[idx] = { ...memoryStudios[idx], ...req.body };
            return (0, response_1.sendSuccess)(res, memoryStudios[idx], 'Photography studio updated successfully (fallback)');
        }
        return (0, response_1.sendSuccess)(res, null, 'Photography studio not found', 404);
    }
};
exports.updatePhotographyStudio = updatePhotographyStudio;
const deletePhotographyStudio = async (req, res) => {
    const rawId = req.query.id || req.params.id;
    const id = String(rawId || '');
    try {
        await prisma_1.prisma.photographyBusiness.delete({ where: { id } });
        memoryStudios = memoryStudios.filter((s) => s.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Photography studio deleted successfully');
    }
    catch (error) {
        memoryStudios = memoryStudios.filter((s) => s.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Photography studio deleted successfully (fallback)');
    }
};
exports.deletePhotographyStudio = deletePhotographyStudio;
