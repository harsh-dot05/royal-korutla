import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess } from '../utils/response';

let memoryEmergencyContacts: any[] = [
  { id: 'ec-1', name: 'Korutla Police Station', category: 'Police', phone: '100 / +91 87908 11111', address: 'Police Station Road, Korutla', available24x7: true },
  { id: 'ec-2', name: 'Fire Station Korutla', category: 'Fire', phone: '101 / +91 87908 22222', address: 'Near Bus Stand, Korutla', available24x7: true },
  { id: 'ec-3', name: 'Ambulance Service (108)', category: 'Medical', phone: '108', address: 'Govt Hospital, Korutla', available24x7: true },
  { id: 'ec-4', name: 'Korutla Municipal Office', category: 'Municipal', phone: '+91 87908 33333', address: 'Municipal Road, Korutla', available24x7: false },
  { id: 'ec-5', name: 'Korutla Government Hospital', category: 'Medical', phone: '+91 87908 44444', address: 'Hospital Road, Korutla', available24x7: true },
];

export const getEmergencyContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await prisma.emergencyContact.findMany({ orderBy: { category: 'asc' } });
    return sendSuccess(res, contacts, 'Emergency contacts retrieved');
  } catch (error) {
    return sendSuccess(res, memoryEmergencyContacts, 'Emergency contacts retrieved (fallback)');
  }
};

export const createEmergencyContact = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const newContact = await prisma.emergencyContact.create({
      data: {
        name: String(body.name || ''),
        category: String(body.category || ''),
        phone: String(body.phone || ''),
        address: String(body.address || 'Korutla'),
        available24x7: body.available24x7 ?? true,
      },
    });
    memoryEmergencyContacts.push(newContact as any);
    return sendSuccess(res, newContact, 'Emergency contact created', 201);
  } catch (error) {
    const fallback = { id: `ec-${Date.now()}`, ...body };
    memoryEmergencyContacts.push(fallback);
    return sendSuccess(res, fallback, 'Emergency contact created (fallback)', 201);
  }
};

export const deleteEmergencyContact = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  try {
    await prisma.emergencyContact.delete({ where: { id } });
    memoryEmergencyContacts = memoryEmergencyContacts.filter((e) => e.id !== id);
    return sendSuccess(res, null, 'Emergency contact deleted');
  } catch (error) {
    memoryEmergencyContacts = memoryEmergencyContacts.filter((e) => e.id !== id);
    return sendSuccess(res, null, 'Emergency contact deleted (fallback)');
  }
};
