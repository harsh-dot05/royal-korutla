import crypto from 'crypto';
import { BusinessOwnerAccount, SafeBusinessOwnerAccount } from '@/types';

/**
 * Securely hash password using PBKDF2 with random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored hash (salt:hash)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash));
  } catch {
    return false;
  }
}

// Initial seed business owner accounts for verified Korutla businesses
const initialBusinessOwners: BusinessOwnerAccount[] = [
  {
    id: 'biz-owner-001',
    name: 'Mohammed Ahmed',
    email: 'ahmed@royalbiryani.com',
    phone: '+91 98765 43210',
    password_hash: hashPassword('RoyalParadise2026!'),
    businessId: 'biz-1',
    businessName: 'Royal Paradise Multi-Cuisine Restaurant',
    role: 'BUSINESS_OWNER',
    isActive: true,
    createdAt: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'biz-owner-002',
    name: 'B. Laxman Rao',
    email: 'laxman@srilaxmi.com',
    phone: '+91 94400 98765',
    password_hash: hashPassword('SriLaxmi2026!'),
    businessId: 'biz-3',
    businessName: 'Sri Laxmi Textiles & Silks',
    role: 'BUSINESS_OWNER',
    isActive: true,
    createdAt: new Date('2026-01-05').toISOString(),
  },
  {
    id: 'biz-owner-003',
    name: 'Ravi Sharma',
    email: 'ravi@srisairam.com',
    phone: '+91 98661 22334',
    password_hash: hashPassword('SaiRam2026!'),
    businessId: 'biz-5',
    businessName: 'Sri Sai Ram Electricals & AC Service',
    role: 'BUSINESS_OWNER',
    isActive: true,
    createdAt: new Date('2026-01-10').toISOString(),
  },
];

const businessOwnersStore: BusinessOwnerAccount[] = [...initialBusinessOwners];

/**
 * Strips password hash from account
 */
export function toSafeBusinessOwnerAccount(
  account: BusinessOwnerAccount
): SafeBusinessOwnerAccount {
  const { password_hash: _ignored, ...safe } = account;
  void _ignored;
  return safe;
}

/**
 * Find owner by ID
 */
export function getBusinessOwnerById(id: string): BusinessOwnerAccount | null {
  return businessOwnersStore.find((u) => u.id === id) || null;
}

/**
 * Find owner by email
 */
export function getBusinessOwnerByEmail(email: string): BusinessOwnerAccount | null {
  const cleanEmail = email.trim().toLowerCase();
  return (
    businessOwnersStore.find((u) => u.email.trim().toLowerCase() === cleanEmail) || null
  );
}

/**
 * Find owner by business ID
 */
export function getBusinessOwnerByBusinessId(businessId: string): BusinessOwnerAccount | null {
  return businessOwnersStore.find((u) => u.businessId === businessId) || null;
}

/**
 * Get all business owners (safe)
 */
export function getAllBusinessOwners(): SafeBusinessOwnerAccount[] {
  return businessOwnersStore.map(toSafeBusinessOwnerAccount);
}

/**
 * Authenticate business owner by credentials
 */
export function authenticateBusinessOwner(
  email: string,
  plainPassword: string
): {
  success: boolean;
  user?: SafeBusinessOwnerAccount;
  error?: 'INVALID_CREDENTIALS' | 'ACCOUNT_INACTIVE';
  message?: string;
} {
  const account = getBusinessOwnerByEmail(email);

  if (!account) {
    return {
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password.',
    };
  }

  const isMatch = verifyPassword(plainPassword, account.password_hash);
  if (!isMatch) {
    return {
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password.',
    };
  }

  if (!account.isActive) {
    return {
      success: false,
      error: 'ACCOUNT_INACTIVE',
      message: 'This business account has been deactivated. Contact Royal Korutla admin.',
    };
  }

  return {
    success: true,
    user: toSafeBusinessOwnerAccount(account),
    message: 'Business owner authentication successful.',
  };
}

/**
 * Update business owner account
 */
export function updateBusinessOwnerAccount(
  id: string,
  updates: Partial<Omit<BusinessOwnerAccount, 'id' | 'role'>>
): SafeBusinessOwnerAccount | null {
  const index = businessOwnersStore.findIndex((u) => u.id === id);
  if (index === -1) return null;

  businessOwnersStore[index] = {
    ...businessOwnersStore[index],
    ...updates,
  };

  return toSafeBusinessOwnerAccount(businessOwnersStore[index]);
}
