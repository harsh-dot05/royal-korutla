import crypto from 'crypto';
import { UserRole } from '@/types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  is_active: boolean;
  created_at: string;
}

export type SafeAdminUser = Omit<AdminUser, 'password_hash'>;

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
  } catch (e) {
    return false;
  }
}

// Default initial credentials from environment
const ENV_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@royalkorutla.com';
const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'RoyalKorutla';

// In-memory admin users store, initialized with owner account as SUPER_ADMIN
let adminUsersStore: AdminUser[] = [
  {
    id: 'admin-super-001',
    name: 'Royal Korutla Owner',
    email: ENV_ADMIN_EMAIL.trim().toLowerCase(),
    password_hash: hashPassword(ENV_ADMIN_PASSWORD),
    role: 'SUPER_ADMIN',
    is_active: true,
    created_at: new Date('2026-01-01').toISOString(),
  },
];

// Optional secondary owner email if configured in env
if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.trim().toLowerCase() !== 'admin@royalkorutla.com') {
  const secondaryEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const existing = adminUsersStore.find(u => u.email === secondaryEmail);
  if (!existing) {
    adminUsersStore.push({
      id: 'admin-super-002',
      name: 'Primary Owner',
      email: secondaryEmail,
      password_hash: hashPassword(process.env.ADMIN_PASSWORD || 'RoyalKorutla'),
      role: 'SUPER_ADMIN',
      is_active: true,
      created_at: new Date().toISOString(),
    });
  }
}

/**
 * Remove sensitive password_hash before returning to client
 */
export function toSafeAdminUser(user: AdminUser): SafeAdminUser {
  const { password_hash, ...safe } = user;
  return safe;
}

/**
 * Get all admin users (without password hashes)
 */
export function getAllAdminUsers(): SafeAdminUser[] {
  return adminUsersStore.map(toSafeAdminUser);
}

/**
 * Find admin user by ID
 */
export function getAdminById(id: string): AdminUser | null {
  return adminUsersStore.find(u => u.id === id) || null;
}

/**
 * Find admin user by email (case insensitive)
 */
export function getAdminByEmail(email: string): AdminUser | null {
  const cleanEmail = (email || '').trim().toLowerCase();
  return adminUsersStore.find(u => u.email.toLowerCase() === cleanEmail) || null;
}

/**
 * Authenticate admin login attempt
 */
export function authenticateAdmin(email: string, password: string): {
  success: boolean;
  user?: SafeAdminUser;
  error?: 'INVALID_CREDENTIALS' | 'ACCOUNT_INACTIVE';
  message?: string;
} {
  const admin = getAdminByEmail(email);

  if (!admin) {
    return {
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid credentials.',
    };
  }

  if (!admin.is_active) {
    return {
      success: false,
      error: 'ACCOUNT_INACTIVE',
      message: 'Account inactive. Contact Super Admin.',
    };
  }

  const isValidPassword = verifyPassword(password, admin.password_hash);
  if (!isValidPassword) {
    return {
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid credentials.',
    };
  }

  return {
    success: true,
    user: toSafeAdminUser(admin),
    message: 'Login successful.',
  };
}

/**
 * Create a new admin account (SUPER_ADMIN only)
 */
export function createAdminUser(data: {
  name: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}): { success: boolean; user?: SafeAdminUser; message?: string } {
  const cleanEmail = (data.email || '').trim().toLowerCase();

  if (!cleanEmail || !data.name || !data.password) {
    return { success: false, message: 'Name, email, and password are required.' };
  }

  if (getAdminByEmail(cleanEmail)) {
    return { success: false, message: 'An admin account with this email already exists.' };
  }

  const newAdmin: AdminUser = {
    id: `admin-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: data.name.trim(),
    email: cleanEmail,
    password_hash: hashPassword(data.password),
    role: data.role || 'ADMIN',
    is_active: true,
    created_at: new Date().toISOString(),
  };

  adminUsersStore = [newAdmin, ...adminUsersStore];
  return { success: true, user: toSafeAdminUser(newAdmin) };
}

/**
 * Update admin user details (SUPER_ADMIN only)
 */
export function updateAdminUser(
  id: string,
  updates: {
    name?: string;
    email?: string;
    role?: 'SUPER_ADMIN' | 'ADMIN';
    is_active?: boolean;
  }
): { success: boolean; user?: SafeAdminUser; message?: string } {
  const index = adminUsersStore.findIndex(u => u.id === id);
  if (index === -1) {
    return { success: false, message: 'Admin account not found.' };
  }

  const current = adminUsersStore[index];

  if (updates.email && updates.email.trim().toLowerCase() !== current.email) {
    const existing = getAdminByEmail(updates.email);
    if (existing && existing.id !== id) {
      return { success: false, message: 'Email address is already in use by another admin.' };
    }
  }

  const updatedAdmin: AdminUser = {
    ...current,
    name: updates.name ? updates.name.trim() : current.name,
    email: updates.email ? updates.email.trim().toLowerCase() : current.email,
    role: updates.role !== undefined ? updates.role : current.role,
    is_active: updates.is_active !== undefined ? updates.is_active : current.is_active,
  };

  adminUsersStore[index] = updatedAdmin;
  return { success: true, user: toSafeAdminUser(updatedAdmin) };
}

/**
 * Reset / change admin password (SUPER_ADMIN only)
 */
export function resetAdminPassword(
  id: string,
  newPassword: string
): { success: boolean; message?: string } {
  const index = adminUsersStore.findIndex(u => u.id === id);
  if (index === -1) {
    return { success: false, message: 'Admin account not found.' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long.' };
  }

  adminUsersStore[index].password_hash = hashPassword(newPassword);
  return { success: true, message: 'Password reset successfully.' };
}

/**
 * Delete admin account (SUPER_ADMIN only)
 */
export function deleteAdminUser(id: string): { success: boolean; message?: string } {
  const admin = getAdminById(id);
  if (!admin) {
    return { success: false, message: 'Admin account not found.' };
  }

  // Prevent deleting the last SUPER_ADMIN
  const superAdmins = adminUsersStore.filter(u => u.role === 'SUPER_ADMIN' && u.is_active);
  if (admin.role === 'SUPER_ADMIN' && superAdmins.length <= 1) {
    return { success: false, message: 'Cannot delete the only active Super Admin account.' };
  }

  adminUsersStore = adminUsersStore.filter(u => u.id !== id);
  return { success: true, message: 'Admin account removed successfully.' };
}
