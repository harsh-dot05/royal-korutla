import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';

export interface EmergencyContactItem {
  id: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  available24x7: boolean;
  isVerified: boolean;
  notes?: string;
  timing?: string;
}

let memoryEmergencyContacts: EmergencyContactItem[] = [
  {
    id: 'em-108',
    name: '108 Emergency Ambulance (Telangana EMRI)',
    category: 'Ambulance',
    phone: '108',
    address: 'Stationed at Govt Area Hospital, Korutla',
    available24x7: true,
    isVerified: true,
    timing: '24 Hours Daily',
    notes: 'Free Government Emergency Medical Service with trained emergency medical technician (EMT) & life-support equipment on board.',
  },
  {
    id: 'em-102',
    name: '102 Maternity Ambulance (JSSK)',
    category: 'Ambulance',
    phone: '102',
    address: 'High School Road, Korutla',
    available24x7: true,
    isVerified: true,
    timing: '24 Hours Daily',
    notes: 'Government dedicated transport for pregnant women, institutional deliveries, and sick infants.',
  },
  {
    id: 'em-hosp-govt',
    name: 'Korutla Government Area Hospital Casualty',
    category: 'Hospital',
    phone: '08725-252300',
    address: 'High School Road, Korutla',
    available24x7: true,
    isVerified: true,
    timing: '24x7 Emergency Casualty',
    notes: 'Resident Medical Officer on duty, primary trauma stabilization, and emergency medication.',
  },
  {
    id: 'em-hosp-lifecare',
    name: 'Korutla LifeCare Hospital Emergency ICU',
    category: 'Hospital',
    phone: '08725-252300 / +91 98480 12345',
    address: 'Metpally Highway Road, Near Govt College, Korutla',
    available24x7: true,
    isVerified: true,
    timing: '24x7 Emergency ICU & Ambulance',
    notes: 'Trauma support, emergency ventilator ICU, diagnostics & on-call specialist doctors.',
  },
  {
    id: 'em-police',
    name: 'Korutla Town Police Station',
    category: 'Police',
    phone: '100 / 08725-252100',
    address: 'Police Station Road, Korutla',
    available24x7: true,
    isVerified: true,
    timing: '24 Hours Daily',
    notes: 'Town Sub-Inspector control desk and 24/7 Blue Colts emergency patrol mobile van.',
  },
  {
    id: 'em-fire',
    name: 'Fire & Rescue Station Korutla',
    category: 'Fire',
    phone: '101 / 08725-252101',
    address: 'Bypass Road, Korutla',
    available24x7: true,
    isVerified: true,
    timing: '24 Hours Daily',
    notes: 'Fire suppression, road accident extrication, and local disaster response rescue.',
  },
  {
    id: 'em-munc',
    name: 'Korutla Municipality Helpline',
    category: 'Municipal',
    phone: '08725-252444',
    address: 'Municipal Complex Road, Korutla',
    available24x7: false,
    isVerified: true,
    timing: '09:30 AM - 05:30 PM (Mon-Sat)',
    notes: 'Municipal drinking water pipeline emergencies, drainage overflow, and civic complaint response.',
  },
];

export const getEmergencyContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await (prisma as any).emergencyContact.findMany({
      orderBy: [{ available24x7: 'desc' }, { category: 'asc' }],
    });
    if (contacts && contacts.length > 0) {
      return sendSuccess(res, contacts, 'Emergency contacts retrieved');
    }
    return sendSuccess(res, memoryEmergencyContacts, 'Emergency contacts retrieved');
  } catch (error) {
    return sendSuccess(res, memoryEmergencyContacts, 'Emergency contacts retrieved (fallback)');
  }
};

export const createEmergencyContact = async (req: Request, res: Response) => {
  const body = req.body;
  if (!body.name || !body.phone || !body.category) {
    return sendError(res, 'VALIDATION_ERROR', 'Name, phone number, and category are required', 400);
  }

  const payload: EmergencyContactItem = {
    id: `ec-${Date.now()}`,
    name: String(body.name).trim(),
    category: String(body.category).trim(),
    phone: String(body.phone).trim(),
    address: String(body.address || 'Korutla').trim(),
    available24x7: Boolean(body.available24x7 ?? true),
    isVerified: Boolean(body.isVerified ?? true),
    notes: body.notes ? String(body.notes).trim() : undefined,
    timing: body.timing ? String(body.timing).trim() : (body.available24x7 ? '24 Hours' : 'Daytime'),
  };

  try {
    const newContact = await (prisma as any).emergencyContact.create({
      data: {
        name: payload.name,
        category: payload.category,
        phone: payload.phone,
        address: payload.address,
        available24x7: payload.available24x7,
        isVerified: payload.isVerified,
        notes: payload.notes,
        timing: payload.timing,
      },
    });
    memoryEmergencyContacts.unshift(newContact as any);
    return sendSuccess(res, newContact, 'Emergency contact created', 201);
  } catch (error) {
    memoryEmergencyContacts.unshift(payload);
    return sendSuccess(res, payload, 'Emergency contact created (fallback)', 201);
  }
};

export const updateEmergencyContact = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  const body = req.body;

  try {
    const updated = await (prisma as any).emergencyContact.update({
      where: { id },
      data: {
        ...(body.name && { name: String(body.name).trim() }),
        ...(body.category && { category: String(body.category).trim() }),
        ...(body.phone && { phone: String(body.phone).trim() }),
        ...(body.address && { address: String(body.address).trim() }),
        ...(body.available24x7 !== undefined && { available24x7: Boolean(body.available24x7) }),
        ...(body.isVerified !== undefined && { isVerified: Boolean(body.isVerified) }),
        ...(body.notes !== undefined && { notes: String(body.notes).trim() }),
        ...(body.timing !== undefined && { timing: String(body.timing).trim() }),
      },
    });

    const idx = memoryEmergencyContacts.findIndex((e) => e.id === id);
    if (idx !== -1) {
      memoryEmergencyContacts[idx] = { ...memoryEmergencyContacts[idx], ...updated };
    }

    return sendSuccess(res, updated, 'Emergency contact updated');
  } catch (error) {
    const idx = memoryEmergencyContacts.findIndex((e) => e.id === id);
    if (idx === -1) {
      return sendError(res, 'NOT_FOUND', 'Emergency contact not found', 404);
    }

    memoryEmergencyContacts[idx] = {
      ...memoryEmergencyContacts[idx],
      ...(body.name && { name: String(body.name).trim() }),
      ...(body.category && { category: String(body.category).trim() }),
      ...(body.phone && { phone: String(body.phone).trim() }),
      ...(body.address && { address: String(body.address).trim() }),
      ...(body.available24x7 !== undefined && { available24x7: Boolean(body.available24x7) }),
      ...(body.isVerified !== undefined && { isVerified: Boolean(body.isVerified) }),
      ...(body.notes !== undefined && { notes: String(body.notes).trim() }),
      ...(body.timing !== undefined && { timing: String(body.timing).trim() }),
    };

    return sendSuccess(res, memoryEmergencyContacts[idx], 'Emergency contact updated (fallback)');
  }
};

export const deleteEmergencyContact = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  try {
    await (prisma as any).emergencyContact.delete({ where: { id } });
    memoryEmergencyContacts = memoryEmergencyContacts.filter((e) => e.id !== id);
    return sendSuccess(res, null, 'Emergency contact deleted');
  } catch (error) {
    memoryEmergencyContacts = memoryEmergencyContacts.filter((e) => e.id !== id);
    return sendSuccess(res, null, 'Emergency contact deleted (fallback)');
  }
};
