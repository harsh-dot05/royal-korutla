import { CommunityPhoto, CommunityPhotoCategory, CommunityPhotoStatus } from '@/types';

/**
 * Community Photography Categories supported on Royal Korutla
 */
export const COMMUNITY_PHOTO_CATEGORIES: CommunityPhotoCategory[] = [
  'Streets & Landmarks',
  'Festivals & Celebrations',
  'Nature & Landscapes',
  'Food & Markets',
  'Architecture & Everyday Life',
  'Culture & Community',
];

/**
 * In-memory store for Community Photography submissions.
 * In accordance with project policy: No fabricated photographs are presented as
 * genuine community submissions. If there are no approved submissions, public pages
 * display an attractive community invitation / empty state.
 */
let communityPhotos: CommunityPhoto[] = [];

/**
 * Get public approved & published photographs.
 * Strict rule: ONLY items with status === 'APPROVED', isPublished === true,
 * AND permissionConfirmed === true are returned to the public gallery.
 */
export function getPublishedCommunityPhotos(category?: string): CommunityPhoto[] {
  return communityPhotos
    .filter(
      (photo) =>
        photo.status === 'APPROVED' &&
        photo.isPublished === true &&
        photo.permissionConfirmed === true
    )
    .filter((photo) => !category || category === 'All' || photo.category === category)
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
}

/**
 * Get featured photographs for the homepage feature.
 */
export function getFeaturedCommunityPhotos(limit = 6): CommunityPhoto[] {
  const published = getPublishedCommunityPhotos();
  const featured = published.filter((p) => p.featuredOnHome);
  if (featured.length >= limit) return featured.slice(0, limit);
  const remaining = published.filter((p) => !p.featuredOnHome);
  return [...featured, ...remaining].slice(0, limit);
}

/**
 * Get all photographs for authenticated admin dashboard view.
 */
export function getAllCommunityPhotosAdmin(filter?: {
  status?: CommunityPhotoStatus | 'ALL';
  category?: string;
  search?: string;
}): CommunityPhoto[] {
  let list = [...communityPhotos];

  if (filter?.status && filter.status !== 'ALL') {
    list = list.filter((p) => p.status === filter.status);
  }

  if (filter?.category && filter.category !== 'All') {
    list = list.filter((p) => p.category === filter.category);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.photographerName.toLowerCase().includes(q) ||
        (p.caption && p.caption.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q))
    );
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get a specific photo by its identifier.
 */
export function getCommunityPhotoById(id: string): CommunityPhoto | undefined {
  return communityPhotos.find((p) => p.id === id);
}

/**
 * Add a new community submission / photo entry (Admin or submission intake).
 */
export function addCommunityPhoto(
  data: Omit<CommunityPhoto, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
  adminEmail?: string
): CommunityPhoto {
  const now = new Date().toISOString();
  const id = data.id || `cphoto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Enforce rule: can only be published if approved AND permission confirmed
  const canPublish = data.status === 'APPROVED' && data.permissionConfirmed === true && Boolean(data.isPublished);

  const newPhoto: CommunityPhoto = {
    id,
    title: data.title.trim(),
    category: data.category,
    imageUrl: data.imageUrl.trim(),
    altText: (data.altText || data.title).trim(),
    photographerName: data.photographerName.trim(),
    caption: data.caption?.trim(),
    location: data.location?.trim(),
    instagram: data.instagram?.trim(),
    portfolioUrl: data.portfolioUrl?.trim(),
    status: data.status || 'PENDING',
    permissionConfirmed: Boolean(data.permissionConfirmed),
    permissionConfirmedAt: data.permissionConfirmed ? data.permissionConfirmedAt || now : undefined,
    permissionNotes: data.permissionNotes?.trim(),
    isPublished: canPublish,
    publishedAt: canPublish ? (data.publishedAt || now) : undefined,
    moderatedBy: adminEmail || data.moderatedBy,
    moderatedAt: data.status !== 'PENDING' ? (data.moderatedAt || now) : undefined,
    rejectionReason: data.rejectionReason?.trim(),
    featuredOnHome: Boolean(data.featuredOnHome),
    createdAt: now,
    updatedAt: now,
  };

  communityPhotos = [newPhoto, ...communityPhotos];
  return newPhoto;
}

/**
 * Update an existing photo entry (Approval, status change, editing metadata).
 */
export function updateCommunityPhoto(
  id: string,
  updates: Partial<CommunityPhoto>,
  adminEmail?: string
): CommunityPhoto | null {
  const index = communityPhotos.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = communityPhotos[index];
  const now = new Date().toISOString();

  const nextStatus = updates.status !== undefined ? updates.status : current.status;
  const nextPermission = updates.permissionConfirmed !== undefined ? updates.permissionConfirmed : current.permissionConfirmed;
  const requestedPublish = updates.isPublished !== undefined ? updates.isPublished : current.isPublished;

  // Strict enforcement: A photo can ONLY be published if APPROVED and permission is confirmed
  const canPublish = nextStatus === 'APPROVED' && nextPermission === true && Boolean(requestedPublish);

  let publishedAt = current.publishedAt;
  if (canPublish && !current.isPublished) {
    publishedAt = now;
  } else if (!canPublish) {
    publishedAt = undefined;
  }

  let permissionConfirmedAt = current.permissionConfirmedAt;
  if (nextPermission && !current.permissionConfirmed) {
    permissionConfirmedAt = now;
  } else if (!nextPermission) {
    permissionConfirmedAt = undefined;
  }

  const updated: CommunityPhoto = {
    ...current,
    ...updates,
    id: current.id,
    title: updates.title !== undefined ? updates.title.trim() : current.title,
    category: updates.category || current.category,
    imageUrl: updates.imageUrl !== undefined ? updates.imageUrl.trim() : current.imageUrl,
    altText: updates.altText !== undefined ? updates.altText.trim() : current.altText,
    photographerName: updates.photographerName !== undefined ? updates.photographerName.trim() : current.photographerName,
    caption: updates.caption !== undefined ? updates.caption?.trim() : current.caption,
    location: updates.location !== undefined ? updates.location?.trim() : current.location,
    instagram: updates.instagram !== undefined ? updates.instagram?.trim() : current.instagram,
    portfolioUrl: updates.portfolioUrl !== undefined ? updates.portfolioUrl?.trim() : current.portfolioUrl,
    status: nextStatus,
    permissionConfirmed: nextPermission,
    permissionConfirmedAt,
    isPublished: canPublish,
    publishedAt,
    moderatedBy: adminEmail || updates.moderatedBy || current.moderatedBy,
    moderatedAt: nextStatus !== current.status ? now : current.moderatedAt,
    rejectionReason: updates.rejectionReason !== undefined ? updates.rejectionReason?.trim() : current.rejectionReason,
    featuredOnHome: updates.featuredOnHome !== undefined ? Boolean(updates.featuredOnHome) : current.featuredOnHome,
    updatedAt: now,
  };

  communityPhotos[index] = updated;
  return updated;
}

/**
 * Delete a photo entry from the community gallery.
 */
export function deleteCommunityPhoto(id: string): boolean {
  const initialLength = communityPhotos.length;
  communityPhotos = communityPhotos.filter((p) => p.id !== id);
  return communityPhotos.length < initialLength;
}
