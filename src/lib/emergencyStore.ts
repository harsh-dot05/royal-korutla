import { EmergencyContact } from '@/types';

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em-108',
    name: '108 Emergency Ambulance (Telangana EMRI)',
    category: 'Ambulance',
    phone: '108',
    address: 'Stationed at Govt Area Hospital, Korutla',
    available24x7: true,
    isVerified: true,
    timing: '24 Hours Daily',
    notes: 'Toll-free government emergency ambulance with emergency medical technician (EMT) and life-support on board.',
    updatedAt: new Date().toISOString(),
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
    notes: 'Government dedicated maternal and infant emergency transport for institutional delivery.',
    updatedAt: new Date().toISOString(),
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
    notes: 'Medical Officer on duty 24/7, primary emergency trauma resuscitation, and emergency medicines.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'em-hosp-lifecare',
    name: 'Korutla LifeCare Hospital Emergency ICU',
    category: 'Hospital',
    phone: '08725-252300',
    address: 'Metpally Highway Road, Near Govt College, Korutla',
    available24x7: true,
    isVerified: true,
    timing: '24x7 Emergency ICU & Ambulance',
    notes: 'Emergency critical care, ventilator ICU, trauma support, digital diagnostics, and on-call ambulance.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'em-police',
    name: 'Korutla Town Police Station',
    category: 'Police',
    phone: '100',
    address: 'Police Station Road, Korutla',
    available24x7: true,
    isVerified: true,
    timing: '24 Hours Daily',
    notes: 'Town police sub-inspector desk, law and order emergency assistance, and local patrol response.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'em-fire',
    name: 'Fire & Rescue Station Korutla',
    category: 'Fire',
    phone: '101',
    address: 'Near Bypass Road, Korutla',
    available24x7: true,
    isVerified: true,
    timing: '24 Hours Daily',
    notes: 'Emergency fire tenders, rescue from road collisions, building entrapments, and natural hazards.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'em-munc',
    name: 'Korutla Municipality Helpline & Civic Desk',
    category: 'Municipal',
    phone: '08725-252444',
    address: 'Municipal Complex Road, Korutla',
    available24x7: false,
    isVerified: true,
    timing: '09:30 AM - 05:30 PM (Mon-Sat)',
    notes: 'Water supply line bursts, public health emergencies, sewer blockages, and civic hazard reporting.',
    updatedAt: new Date().toISOString(),
  },
];

let emergencyStore: EmergencyContact[] = [...INITIAL_EMERGENCY_CONTACTS];

export function getAllEmergencyContacts(): EmergencyContact[] {
  return [...emergencyStore];
}

export function getEmergencyContactById(id: string): EmergencyContact | undefined {
  return emergencyStore.find((c) => c.id === id);
}

export function addEmergencyContact(
  data: Omit<EmergencyContact, 'id' | 'updatedAt'> & { id?: string }
): EmergencyContact {
  const newContact: EmergencyContact = {
    id: data.id || `em-${Date.now()}`,
    name: data.name.trim(),
    category: data.category,
    phone: data.phone.trim(),
    address: data.address.trim(),
    available24x7: Boolean(data.available24x7),
    isVerified: Boolean(data.isVerified ?? true),
    notes: data.notes?.trim(),
    timing: data.timing?.trim() || (data.available24x7 ? '24 Hours Daily' : 'Standard Daytime'),
    updatedAt: new Date().toISOString(),
  };

  emergencyStore = [newContact, ...emergencyStore];
  return newContact;
}

export function updateEmergencyContact(
  id: string,
  updates: Partial<EmergencyContact>
): EmergencyContact | null {
  const index = emergencyStore.findIndex((c) => c.id === id);
  if (index === -1) return null;

  emergencyStore[index] = {
    ...emergencyStore[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return emergencyStore[index];
}

export function deleteEmergencyContact(id: string): boolean {
  const initialLen = emergencyStore.length;
  emergencyStore = emergencyStore.filter((c) => c.id !== id);
  return emergencyStore.length < initialLen;
}
