import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';

let memoryJobs: any[] = [
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

export const getJobs = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const q = req.query.q as string;
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '50', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category && category !== 'all') where.category = category;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { shopName: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.jobListing.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.jobListing.count({ where }),
    ]);

    return sendSuccess(res, { items: jobs, total, page, limit, totalPages: Math.ceil(total / limit) }, 'Jobs retrieved successfully');
  } catch (error) {
    let filtered = memoryJobs;
    const category = req.query.category as string;
    const q = req.query.q as string;
    if (category && category !== 'all') filtered = filtered.filter((j) => j.category === category);
    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter((j) => j.title.toLowerCase().includes(lower) || j.shopName.toLowerCase().includes(lower));
    }
    return sendSuccess(res, { items: filtered, total: filtered.length, page: 1, limit: 50, totalPages: 1 }, 'Jobs retrieved (fallback)');
  }
};

export const getJobById = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  try {
    const job = await prisma.jobListing.findUnique({ where: { id } });
    if (job) return sendSuccess(res, job, 'Job retrieved');
  } catch (_) {}
  const found = memoryJobs.find((j) => j.id === id);
  if (found) return sendSuccess(res, found, 'Job retrieved (fallback)');
  return sendError(res, 'NOT_FOUND', 'Job listing not found', 404);
};

export const createJob = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const newJob = await prisma.jobListing.create({
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
    memoryJobs.unshift(newJob as any);
    return sendSuccess(res, newJob, 'Job listing created', 201);
  } catch (error) {
    const fallback = { id: `job-${Date.now()}`, ...body, isVerified: true, isFeatured: false };
    memoryJobs.unshift(fallback);
    return sendSuccess(res, fallback, 'Job listing created (fallback)', 201);
  }
};

export const updateJob = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  const body = req.body;
  try {
    const updated = await prisma.jobListing.update({ where: { id }, data: body });
    return sendSuccess(res, updated, 'Job updated successfully');
  } catch (error) {
    const idx = memoryJobs.findIndex((j) => j.id === id);
    if (idx !== -1) {
      memoryJobs[idx] = { ...memoryJobs[idx], ...body };
      return sendSuccess(res, memoryJobs[idx], 'Job updated (fallback)');
    }
    return sendError(res, 'NOT_FOUND', 'Job not found', 404);
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  try {
    await prisma.jobListing.delete({ where: { id } });
    memoryJobs = memoryJobs.filter((j) => j.id !== id);
    return sendSuccess(res, null, 'Job deleted successfully');
  } catch (error) {
    memoryJobs = memoryJobs.filter((j) => j.id !== id);
    return sendSuccess(res, null, 'Job deleted (fallback)');
  }
};
