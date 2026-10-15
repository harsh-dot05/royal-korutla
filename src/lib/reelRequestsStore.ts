import { ReelRequest } from '@/types';

// In-memory store for reel requests
let reelRequestsStore: ReelRequest[] = [
  {
    id: 'reel-req-101',
    businessName: 'Royal Paradise Restaurant',
    contactPhone: '+91 98480 12345',
    businessCategory: 'Restaurants & Food',
    reelPurpose: 'product_promotion',
    preferredLanguage: 'Telugu',
    additionalRequirements: 'Want to showcase our new Dum Biryani cooking process and evening seating ambiance.',
    status: 'CONTACTED',
    adminNotes: 'Spoke with manager on Oct 12. Shoot tentatively planned for Friday afternoon.',
    followUpDate: '2026-10-16',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'reel-req-102',
    businessName: 'Sri Laxmi Silk & Sarees',
    contactPhone: '+91 94401 56789',
    businessCategory: 'Clothing & Fashion',
    reelPurpose: 'offer',
    preferredLanguage: 'Telugu',
    additionalRequirements: 'Festival festive saree discounts 25% off reel for Instagram and Royal Korutla app.',
    status: 'SCHEDULED',
    adminNotes: 'Videographer assigned. Slot confirmed: Saturday 11:00 AM.',
    followUpDate: '2026-10-18',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'reel-req-103',
    businessName: 'Korutla Digital Electronics',
    contactPhone: '+91 99890 22334',
    businessCategory: 'Electronics & Mobiles',
    reelPurpose: 'shop_introduction',
    preferredLanguage: 'English',
    additionalRequirements: 'Store opening walk-through highlighting smartphone accessories and repair service counter.',
    status: 'PENDING',
    adminNotes: 'Needs preliminary call regarding lighting and shoot duration.',
    followUpDate: '2026-10-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getAllReelRequests(): ReelRequest[] {
  return [...reelRequestsStore];
}

export function getReelRequestById(id: string): ReelRequest | undefined {
  return reelRequestsStore.find((r) => r.id === id);
}

export function createReelRequest(
  data: Omit<ReelRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
    id?: string;
    status?: ReelRequest['status'];
  }
): ReelRequest {
  const newRequest: ReelRequest = {
    id: data.id || `reel-req-${Date.now()}`,
    businessName: data.businessName.trim(),
    contactPhone: data.contactPhone.trim(),
    businessCategory: data.businessCategory.trim(),
    reelPurpose: data.reelPurpose || 'product_promotion',
    preferredLanguage: data.preferredLanguage || 'Telugu',
    additionalRequirements: data.additionalRequirements?.trim() || '',
    status: data.status || 'PENDING',
    adminNotes: data.adminNotes || '',
    followUpDate: data.followUpDate || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  reelRequestsStore = [newRequest, ...reelRequestsStore];
  return newRequest;
}

export function updateReelRequest(
  id: string,
  updates: Partial<ReelRequest>
): ReelRequest | null {
  const index = reelRequestsStore.findIndex((r) => r.id === id);
  if (index === -1) return null;

  reelRequestsStore[index] = {
    ...reelRequestsStore[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return reelRequestsStore[index];
}

export function deleteReelRequest(id: string): boolean {
  const initialLen = reelRequestsStore.length;
  reelRequestsStore = reelRequestsStore.filter((r) => r.id !== id);
  return reelRequestsStore.length < initialLen;
}
