import { Promotion } from '@/types';
import { PROMOTIONS as INITIAL_PROMOTIONS } from '@/data/mockData';

// Server side in-memory store initialized with mockData
let promotionsStore: Promotion[] = [...INITIAL_PROMOTIONS];

/**
 * Check if a promotion is currently active (within start and end dates and status is ACTIVE)
 */
export function isPromotionActive(promotion: Promotion): boolean {
  if (promotion.status !== 'ACTIVE') return false;

  const todayStr = new Date().toISOString().split('T')[0];
  
  if (promotion.startDate && promotion.startDate > todayStr) {
    return false; // Not started yet
  }
  
  if (promotion.endDate && promotion.endDate < todayStr) {
    return false; // Expired
  }

  return true;
}

/**
 * Get all promotions (active and expired) for Admin Panel
 */
export function getAllPromotions(): Promotion[] {
  // Update status based on end dates automatically
  const todayStr = new Date().toISOString().split('T')[0];
  return promotionsStore.map(p => {
    if (p.endDate && p.endDate < todayStr && p.status === 'ACTIVE') {
      return { ...p, status: 'EXPIRED' as const };
    }
    return p;
  });
}

/**
 * Get only active, non-expired promotions for public website display
 */
export function getActivePromotions(): Promotion[] {
  return getAllPromotions().filter(isPromotionActive);
}

/**
 * Add a new paid business promotion
 */
export function addPromotion(promotionData: Omit<Promotion, 'id'> & { id?: string }): Promotion {
  const newPromotion: Promotion = {
    id: promotionData.id || `prom-${Date.now()}`,
    businessId: promotionData.businessId,
    businessName: promotionData.businessName,
    promotionType: promotionData.promotionType,
    placement: promotionData.placement || 'Homepage',
    startDate: promotionData.startDate || new Date().toISOString().split('T')[0],
    endDate: promotionData.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    priority: promotionData.priority || 1,
    status: promotionData.status || 'ACTIVE',
    badgeLabel: promotionData.badgeLabel || 'PROMOTED',
    bannerImage: promotionData.bannerImage,
    title: promotionData.title,
    description: promotionData.description,
    offerText: promotionData.offerText,
  };

  promotionsStore = [newPromotion, ...promotionsStore];
  return newPromotion;
}

/**
 * Update existing promotion
 */
export function updatePromotion(id: string, updates: Partial<Promotion>): Promotion | null {
  const index = promotionsStore.findIndex(p => p.id === id);
  if (index === -1) return null;

  promotionsStore[index] = {
    ...promotionsStore[index],
    ...updates,
  };

  return promotionsStore[index];
}

/**
 * Delete a promotion
 */
export function deletePromotion(id: string): boolean {
  const initialLength = promotionsStore.length;
  promotionsStore = promotionsStore.filter(p => p.id !== id);
  return promotionsStore.length < initialLength;
}
