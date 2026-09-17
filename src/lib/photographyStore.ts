import { PhotographyBusiness } from '@/types';
import { PHOTOGRAPHY_BUSINESSES as INITIAL_PHOTOGRAPHY } from '@/data/mockData';

let photographyStore: PhotographyBusiness[] = [...INITIAL_PHOTOGRAPHY];

export function getAllPhotographyBusinesses(): PhotographyBusiness[] {
  return [...photographyStore];
}

export function getPhotographyBusinessById(id: string): PhotographyBusiness | undefined {
  return photographyStore.find((item) => item.id === id);
}

export function addPhotographyBusiness(
  data: Omit<PhotographyBusiness, 'id'> & { id?: string }
): PhotographyBusiness {
  const newStudio: PhotographyBusiness = {
    id: data.id || `photo-${Date.now()}`,
    name: data.name,
    profileImage: data.profileImage,
    coverImage: data.coverImage,
    location: data.location || 'Korutla',
    landmark: data.landmark || 'Korutla Town',
    phone: data.phone,
    whatsapp: data.whatsapp || data.phone,
    instagram: data.instagram,
    description: data.description,
    photographyTypes: data.photographyTypes || ['Wedding', 'Event'],
    startingPrice: data.startingPrice,
    openingHours: data.openingHours || '09:00 AM - 09:00 PM',
    isVerified: data.isVerified ?? true,
    isFeatured: data.isFeatured ?? false,
    rating: data.rating ?? 4.9,
    reviewCount: data.reviewCount ?? 1,
    galleryImages: data.galleryImages || [],
  };

  photographyStore = [newStudio, ...photographyStore];
  return newStudio;
}

export function updatePhotographyBusiness(
  id: string,
  updates: Partial<PhotographyBusiness>
): PhotographyBusiness | null {
  const index = photographyStore.findIndex((p) => p.id === id);
  if (index === -1) return null;

  photographyStore[index] = {
    ...photographyStore[index],
    ...updates,
  };

  return photographyStore[index];
}

export function deletePhotographyBusiness(id: string): boolean {
  const initialLength = photographyStore.length;
  photographyStore = photographyStore.filter((p) => p.id !== id);
  return photographyStore.length < initialLength;
}
