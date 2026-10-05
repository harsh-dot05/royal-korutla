import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';

let memoryHospitals: any[] = [
  {
    id: 'hosp-1',
    name: 'Korutla LifeCare Super Specialty Hospital',
    tagline: 'Advanced Care. Trusted Healing.',
    address: 'Metpally Highway Road, Korutla',
    landmark: 'Near Govt Degree College',
    emergencyPhone: '+91 98480 12345',
    appointmentPhone: '+91 98480 12346',
    timing: '24 Hours Open',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
    departments: ['General Medicine', 'Orthopedics', 'Gynecology', 'Pediatrics', 'Cardiology'],
    facilities: ['ICU', 'Emergency', 'Digital X-Ray', 'Pathology Lab', 'Pharmacy', 'Ambulance'],
    is24x7: true,
    doctors: [],
  },
  {
    id: 'hosp-2',
    name: 'Korutla Government Area Hospital',
    tagline: 'Free Treatment. Compassionate Care.',
    address: 'Hospital Road, Korutla',
    landmark: 'Near Municipal Office',
    emergencyPhone: '108',
    appointmentPhone: '+91 87908 00000',
    timing: '08:00 AM - 08:00 PM (OPD) | 24/7 Emergency',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    departments: ['General Medicine', 'Surgery', 'Maternity', 'Paediatrics'],
    facilities: ['Emergency Ward', 'OPD', 'Maternity Ward', 'Pharmacy', '108 Ambulance'],
    is24x7: true,
    doctors: [],
  },
];

let memoryDoctors: any[] = [
  {
    id: 'doc-1',
    hospitalId: 'hosp-1',
    name: 'Dr. K. Srinivas Reddy',
    qualification: 'MBBS, MS (Ortho)',
    specialization: 'Orthopedics',
    experienceYears: 15,
    hospitalName: 'Korutla LifeCare Super Specialty Hospital',
    hospitalAddress: 'Metpally Highway Road, Korutla',
    timings: 'Mon-Sat: 10:00 AM - 1:00 PM',
    consultationFee: '₹300',
    phone: '+91 98480 12345',
    whatsapp: '+91 98480 12345',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  {
    id: 'doc-2',
    hospitalId: 'hosp-1',
    name: 'Dr. Priya Sharma',
    qualification: 'MBBS, MD (Gynecology)',
    specialization: 'Gynecology & Obstetrics',
    experienceYears: 12,
    hospitalName: 'Korutla LifeCare Super Specialty Hospital',
    hospitalAddress: 'Metpally Highway Road, Korutla',
    timings: 'Mon-Fri: 09:00 AM - 2:00 PM',
    consultationFee: '₹400',
    phone: '+91 94400 12345',
    whatsapp: '+91 94400 12345',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
];

export const getHospitals = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
      ];
    }
    const hospitals = await prisma.hospital.findMany({ where, include: { doctors: true }, orderBy: { createdAt: 'desc' } });
    return sendSuccess(res, hospitals, 'Hospitals retrieved successfully');
  } catch (error) {
    let filtered = memoryHospitals;
    const q = req.query.q as string;
    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter((h) => h.name.toLowerCase().includes(lower) || h.address.toLowerCase().includes(lower));
    }
    return sendSuccess(res, filtered, 'Hospitals retrieved (fallback)');
  }
};

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const specialization = req.query.specialization as string;
    const q = req.query.q as string;
    const where: any = {};
    if (specialization && specialization !== 'all') where.specialization = specialization;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { specialization: { contains: q, mode: 'insensitive' } },
        { hospitalName: { contains: q, mode: 'insensitive' } },
      ];
    }
    const doctors = await prisma.doctor.findMany({ where, orderBy: { createdAt: 'desc' } });
    return sendSuccess(res, doctors, 'Doctors retrieved successfully');
  } catch (error) {
    let filtered = memoryDoctors;
    const specialization = req.query.specialization as string;
    const q = req.query.q as string;
    if (specialization && specialization !== 'all') filtered = filtered.filter((d) => d.specialization === specialization);
    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter((d) => d.name.toLowerCase().includes(lower) || d.specialization.toLowerCase().includes(lower));
    }
    return sendSuccess(res, filtered, 'Doctors retrieved (fallback)');
  }
};

export const createHospital = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const newHospital = await prisma.hospital.create({
      data: {
        name: String(body.name || ''),
        tagline: String(body.tagline || 'Quality Healthcare in Korutla'),
        address: String(body.address || ''),
        landmark: String(body.landmark || 'Korutla'),
        emergencyPhone: String(body.emergencyPhone || ''),
        appointmentPhone: String(body.appointmentPhone || body.emergencyPhone || ''),
        timing: String(body.timing || '24 Hours Open'),
        image: String(body.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'),
        departments: Array.isArray(body.departments) ? body.departments : [],
        facilities: Array.isArray(body.facilities) ? body.facilities : [],
        is24x7: body.is24x7 ?? true,
      },
    });
    memoryHospitals.unshift(newHospital as any);
    return sendSuccess(res, newHospital, 'Hospital created successfully', 201);
  } catch (error) {
    const fallback = { id: `hosp-${Date.now()}`, ...body, doctors: [] };
    memoryHospitals.unshift(fallback);
    return sendSuccess(res, fallback, 'Hospital created (fallback)', 201);
  }
};

export const createDoctor = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const newDoctor = await prisma.doctor.create({
      data: {
        hospitalId: body.hospitalId ? String(body.hospitalId) : undefined,
        name: String(body.name || ''),
        qualification: String(body.qualification || ''),
        specialization: String(body.specialization || ''),
        experienceYears: Number(body.experienceYears) || 0,
        hospitalName: String(body.hospitalName || ''),
        hospitalAddress: String(body.hospitalAddress || ''),
        timings: String(body.timings || ''),
        consultationFee: String(body.consultationFee || '₹200'),
        phone: String(body.phone || ''),
        whatsapp: body.whatsapp ? String(body.whatsapp) : String(body.phone || ''),
        image: String(body.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80'),
        availableDays: Array.isArray(body.availableDays) ? body.availableDays : [],
      },
    });
    memoryDoctors.unshift(newDoctor as any);
    return sendSuccess(res, newDoctor, 'Doctor created successfully', 201);
  } catch (error) {
    const fallback = { id: `doc-${Date.now()}`, ...body };
    memoryDoctors.unshift(fallback);
    return sendSuccess(res, fallback, 'Doctor created (fallback)', 201);
  }
};


export const deleteHospital = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  try {
    await prisma.hospital.delete({ where: { id } });
    memoryHospitals = memoryHospitals.filter((h) => h.id !== id);
    return sendSuccess(res, null, 'Hospital deleted successfully');
  } catch (error) {
    memoryHospitals = memoryHospitals.filter((h) => h.id !== id);
    return sendSuccess(res, null, 'Hospital deleted (fallback)');
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  try {
    await prisma.doctor.delete({ where: { id } });
    memoryDoctors = memoryDoctors.filter((d) => d.id !== id);
    return sendSuccess(res, null, 'Doctor deleted successfully');
  } catch (error) {
    memoryDoctors = memoryDoctors.filter((d) => d.id !== id);
    return sendSuccess(res, null, 'Doctor deleted (fallback)');
  }
};
