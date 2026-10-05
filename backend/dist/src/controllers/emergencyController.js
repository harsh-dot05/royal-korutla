"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmergencyContact = exports.createEmergencyContact = exports.getEmergencyContacts = void 0;
const prisma_1 = require("../utils/prisma");
const response_1 = require("../utils/response");
let memoryEmergencyContacts = [
    { id: 'ec-1', name: 'Korutla Police Station', category: 'Police', phone: '100 / +91 87908 11111', address: 'Police Station Road, Korutla', available24x7: true },
    { id: 'ec-2', name: 'Fire Station Korutla', category: 'Fire', phone: '101 / +91 87908 22222', address: 'Near Bus Stand, Korutla', available24x7: true },
    { id: 'ec-3', name: 'Ambulance Service (108)', category: 'Medical', phone: '108', address: 'Govt Hospital, Korutla', available24x7: true },
    { id: 'ec-4', name: 'Korutla Municipal Office', category: 'Municipal', phone: '+91 87908 33333', address: 'Municipal Road, Korutla', available24x7: false },
    { id: 'ec-5', name: 'Korutla Government Hospital', category: 'Medical', phone: '+91 87908 44444', address: 'Hospital Road, Korutla', available24x7: true },
];
const getEmergencyContacts = async (req, res) => {
    try {
        const contacts = await prisma_1.prisma.emergencyContact.findMany({ orderBy: { category: 'asc' } });
        return (0, response_1.sendSuccess)(res, contacts, 'Emergency contacts retrieved');
    }
    catch (error) {
        return (0, response_1.sendSuccess)(res, memoryEmergencyContacts, 'Emergency contacts retrieved (fallback)');
    }
};
exports.getEmergencyContacts = getEmergencyContacts;
const createEmergencyContact = async (req, res) => {
    const body = req.body;
    try {
        const newContact = await prisma_1.prisma.emergencyContact.create({
            data: {
                name: String(body.name || ''),
                category: String(body.category || ''),
                phone: String(body.phone || ''),
                address: String(body.address || 'Korutla'),
                available24x7: body.available24x7 ?? true,
            },
        });
        memoryEmergencyContacts.push(newContact);
        return (0, response_1.sendSuccess)(res, newContact, 'Emergency contact created', 201);
    }
    catch (error) {
        const fallback = { id: `ec-${Date.now()}`, ...body };
        memoryEmergencyContacts.push(fallback);
        return (0, response_1.sendSuccess)(res, fallback, 'Emergency contact created (fallback)', 201);
    }
};
exports.createEmergencyContact = createEmergencyContact;
const deleteEmergencyContact = async (req, res) => {
    const id = String(req.params.id || '');
    try {
        await prisma_1.prisma.emergencyContact.delete({ where: { id } });
        memoryEmergencyContacts = memoryEmergencyContacts.filter((e) => e.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Emergency contact deleted');
    }
    catch (error) {
        memoryEmergencyContacts = memoryEmergencyContacts.filter((e) => e.id !== id);
        return (0, response_1.sendSuccess)(res, null, 'Emergency contact deleted (fallback)');
    }
};
exports.deleteEmergencyContact = deleteEmergencyContact;
