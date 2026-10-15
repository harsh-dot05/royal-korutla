import { PublicRepresentative, RepresentativeRole } from '@/types';

// Generate standard 33 wards plus MLA and Chairman records
const INITIAL_REPRESENTATIVES: PublicRepresentative[] = [
  {
    id: 'rep-mla',
    role: 'MLA',
    name: '',
    designation: 'Member of Legislative Assembly (MLA) - Korutla Constituency',
    constituency: 'Korutla Assembly Constituency (Telangana)',
    areaName: 'Korutla, Metpally, Ibrahimpatnam & Medipally Mandals',
    photoUrl: '',
    phone: '',
    email: '',
    officeAddress: '',
    termPeriod: 'Current Legislative Assembly Term',
    isVerified: false,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rep-chairman',
    role: 'MUNICIPAL_CHAIRMAN',
    name: '',
    designation: 'Municipal Chairperson / Chairman - Korutla Municipality',
    constituency: 'Korutla Municipality',
    areaName: 'Korutla Municipal Council Office',
    photoUrl: '',
    phone: '',
    email: '',
    officeAddress: '',
    termPeriod: 'Current Municipal Council Term',
    isVerified: false,
    updatedAt: new Date().toISOString(),
  },
  ...Array.from({ length: 33 }, (_, idx) => {
    const wardNumber = idx + 1;
    return {
      id: `rep-ward-${wardNumber}`,
      role: 'WARD_COUNCILLOR' as RepresentativeRole,
      wardNumber,
      name: '',
      designation: `Ward Councillor - Ward ${wardNumber}`,
      constituency: 'Korutla Municipality',
      areaName: `Ward ${wardNumber} Jurisdiction`,
      photoUrl: '',
      phone: '',
      email: '',
      officeAddress: '',
      termPeriod: 'Current Municipal Council',
      isVerified: false,
      updatedAt: new Date().toISOString(),
    };
  }),
];

// In-memory store
let representativesStore: PublicRepresentative[] = [...INITIAL_REPRESENTATIVES];

export function getAllRepresentatives(): PublicRepresentative[] {
  return [...representativesStore];
}

export function getRepresentativeById(id: string): PublicRepresentative | undefined {
  return representativesStore.find((r) => r.id === id);
}

export function getRepresentativesByRole(role: RepresentativeRole): PublicRepresentative[] {
  return representativesStore.filter((r) => r.role === role);
}

export function getWardCouncillors(): PublicRepresentative[] {
  return representativesStore
    .filter((r) => r.role === 'WARD_COUNCILLOR')
    .sort((a, b) => (a.wardNumber || 0) - (b.wardNumber || 0));
}

export function updateRepresentative(
  id: string,
  updates: Partial<PublicRepresentative>
): PublicRepresentative | null {
  const index = representativesStore.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = representativesStore[index];
  const updated: PublicRepresentative = {
    ...current,
    ...updates,
    id: current.id, // Preserve id
    role: updates.role || current.role,
    updatedAt: new Date().toISOString(),
  };

  representativesStore[index] = updated;
  return updated;
}

export function addRepresentative(
  data: Omit<PublicRepresentative, 'id' | 'updatedAt'>
): PublicRepresentative {
  const newRep: PublicRepresentative = {
    ...data,
    id: `rep-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };

  representativesStore.push(newRep);
  return newRep;
}

export function deleteRepresentative(id: string): boolean {
  // If it's a fixed slot (MLA, Chairman, or standard 33 wards), reset to empty unverified state rather than removing slot
  const index = representativesStore.findIndex((r) => r.id === id);
  if (index === -1) return false;

  const target = representativesStore[index];
  if (target.id === 'rep-mla' || target.id === 'rep-chairman' || target.id.startsWith('rep-ward-')) {
    representativesStore[index] = {
      ...target,
      name: '',
      photoUrl: '',
      phone: '',
      email: '',
      officeAddress: '',
      isVerified: false,
      updatedAt: new Date().toISOString(),
    };
    return true;
  }

  representativesStore = representativesStore.filter((r) => r.id !== id);
  return true;
}
