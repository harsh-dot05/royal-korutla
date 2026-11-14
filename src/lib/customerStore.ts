import { CustomerUser, CustomerUserType } from '@/types';

/**
 * Normalizes Indian phone numbers into standard E.164 format: +91XXXXXXXXXX
 * Validates that the number consists of 10 digits starting with 6, 7, 8, or 9.
 */
export function normalizeIndianPhone(input: string): {
  isValid: boolean;
  normalized: string;
  rawDigits: string;
  error?: string;
} {
  if (!input || typeof input !== 'string') {
    return { isValid: false, normalized: '', rawDigits: '', error: 'Mobile number is required.' };
  }

  // Remove all non-digit characters
  const digitsOnly = input.replace(/\D/g, '');

  let tenDigit = '';

  if (digitsOnly.length === 10) {
    tenDigit = digitsOnly;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    tenDigit = digitsOnly.substring(1);
  } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    tenDigit = digitsOnly.substring(2);
  } else if (digitsOnly.length === 13 && digitsOnly.startsWith('091')) {
    tenDigit = digitsOnly.substring(3);
  } else {
    return {
      isValid: false,
      normalized: '',
      rawDigits: digitsOnly,
      error: 'Please enter a valid 10-digit Indian mobile number.',
    };
  }

  // Check valid Indian mobile prefix (starts with 6, 7, 8, or 9)
  if (!/^[6-9]\d{9}$/.test(tenDigit)) {
    return {
      isValid: false,
      normalized: '',
      rawDigits: tenDigit,
      error: 'Mobile number must start with 6, 7, 8, or 9.',
    };
  }

  return {
    isValid: true,
    normalized: `+91${tenDigit}`,
    rawDigits: tenDigit,
  };
}

/**
 * Validates registration input fields server-side
 */
export function validateCustomerRegistration(input: {
  name?: string;
  phone?: string;
  userType?: string;
  wardNumber?: number | string | null;
  villageName?: string | null;
}): {
  isValid: boolean;
  errors: Record<string, string>;
  cleanedData?: {
    name: string;
    phone: string;
    userType: CustomerUserType;
    wardNumber: number | null;
    villageName: string | null;
  };
} {
  const errors: Record<string, string> = {};

  // Name validation
  const name = (input.name || '').trim();
  if (!name) {
    errors.name = 'Full name is required.';
  } else if (name.length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  } else if (name.length > 80) {
    errors.name = 'Full name cannot exceed 80 characters.';
  }

  // Phone validation
  const phoneRes = normalizeIndianPhone(input.phone || '');
  if (!phoneRes.isValid) {
    errors.phone = phoneRes.error || 'Invalid mobile number.';
  }

  // Residency & Conditional Ward / Village validation
  const userType = input.userType as CustomerUserType;
  if (userType !== 'KORUTLA_RESIDENT' && userType !== 'NON_LOCAL') {
    errors.userType = 'Please select whether you are a Korutla resident or from outside Korutla.';
  }

  let wardNum: number | null = null;
  let village: string | null = null;

  if (userType === 'KORUTLA_RESIDENT') {
    const rawWard = input.wardNumber;
    const parsedWard = typeof rawWard === 'number' ? rawWard : parseInt(String(rawWard || ''), 10);
    if (isNaN(parsedWard) || parsedWard < 1 || parsedWard > 33) {
      errors.wardNumber = 'Please select a valid Korutla Municipal Ward between 1 and 33.';
    } else {
      wardNum = parsedWard;
    }
  } else if (userType === 'NON_LOCAL') {
    const rawVillage = (input.villageName || '').trim();
    if (!rawVillage) {
      errors.villageName = 'Please enter your village or town name.';
    } else if (rawVillage.length < 2) {
      errors.villageName = 'Village name must be at least 2 characters.';
    } else if (rawVillage.length > 60) {
      errors.villageName = 'Village name cannot exceed 60 characters.';
    } else {
      village = rawVillage;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: {},
    cleanedData: {
      name,
      phone: phoneRes.normalized,
      userType,
      wardNumber: wardNum,
      villageName: village,
    },
  };
}

// Initial seed customer users
const initialCustomers: CustomerUser[] = [
  {
    id: 'cust-seed-001',
    name: 'Srinivas Rao Goud',
    phone: '+919440123456',
    userType: 'KORUTLA_RESIDENT',
    wardNumber: 12,
    villageName: null,
    role: 'CUSTOMER',
    isVerified: true,
    points: 1300,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'cust-seed-002',
    name: 'Kavitha Reddy',
    phone: '+919849012345',
    userType: 'NON_LOCAL',
    wardNumber: null,
    villageName: 'Medipally',
    role: 'CUSTOMER',
    isVerified: true,
    points: 450,
    createdAt: '2026-02-01T12:00:00.000Z',
    updatedAt: '2026-02-01T12:00:00.000Z',
  },
];

let customerUsersStore: CustomerUser[] = [...initialCustomers];

export function getAllCustomers(): CustomerUser[] {
  return [...customerUsersStore];
}

export function findCustomerByPhone(phone: string): CustomerUser | null {
  const normalized = normalizeIndianPhone(phone);
  if (!normalized.isValid) return null;
  return customerUsersStore.find((u) => u.phone === normalized.normalized) || null;
}

export function findCustomerById(id: string): CustomerUser | null {
  return customerUsersStore.find((u) => u.id === id) || null;
}

export function createCustomer(data: {
  name: string;
  phone: string;
  userType: CustomerUserType;
  wardNumber?: number | null;
  villageName?: string | null;
}): CustomerUser {
  const normalizedPhone = normalizeIndianPhone(data.phone).normalized;
  const existing = customerUsersStore.find((u) => u.phone === normalizedPhone);
  if (existing) {
    throw new Error('A user with this mobile number is already registered.');
  }

  const now = new Date().toISOString();
  const newCustomer: CustomerUser = {
    id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    phone: normalizedPhone,
    userType: data.userType,
    wardNumber: data.userType === 'KORUTLA_RESIDENT' ? data.wardNumber ?? null : null,
    villageName: data.userType === 'NON_LOCAL' ? data.villageName ?? null : null,
    role: 'CUSTOMER',
    isVerified: true,
    points: 100, // Welcome bonus points
    createdAt: now,
    updatedAt: now,
  };

  customerUsersStore = [newCustomer, ...customerUsersStore];
  return newCustomer;
}

export function updateCustomer(
  id: string,
  updates: Partial<Omit<CustomerUser, 'id' | 'role' | 'createdAt'>>
): CustomerUser | null {
  const index = customerUsersStore.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const current = customerUsersStore[index];

  // If phone is being updated, verify it is not already taken by another customer
  if (updates.phone && updates.phone !== current.phone) {
    const norm = normalizeIndianPhone(updates.phone);
    if (!norm.isValid) {
      throw new Error(norm.error || 'Invalid phone number format.');
    }
    const duplicate = customerUsersStore.find(
      (u) => u.id !== id && u.phone === norm.normalized
    );
    if (duplicate) {
      throw new Error('This mobile number is already registered to another account.');
    }
    updates.phone = norm.normalized;
  }

  customerUsersStore[index] = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return customerUsersStore[index];
}

export function deleteCustomer(id: string): boolean {
  const initialLen = customerUsersStore.length;
  customerUsersStore = customerUsersStore.filter((u) => u.id !== id);
  return customerUsersStore.length < initialLen;
}
