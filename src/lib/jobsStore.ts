import { JobListing } from '@/types';
import { LOCAL_JOBS as INITIAL_JOBS } from '@/data/mockData';

// In-memory jobs store initialized with mockData
let jobsStore: JobListing[] = [...INITIAL_JOBS];

/**
 * Get all job listings
 */
export function getAllJobs(): JobListing[] {
  return [...jobsStore];
}

/**
 * Add a new job listing with style and color customizations
 */
export function addJob(jobData: Omit<JobListing, 'id'> & { id?: string }): JobListing {
  const newJob: JobListing = {
    id: jobData.id || `job-${Date.now()}`,
    title: jobData.title,
    category: jobData.category || 'General Jobs',
    shopName: jobData.shopName,
    location: jobData.location || 'Korutla Town',
    salary: jobData.salary || 'Negotiable',
    type: jobData.type || 'Full-time',
    experience: jobData.experience || 'Freshers / Experienced',
    phone: jobData.phone || '+91 98480 00000',
    whatsapp: jobData.whatsapp || jobData.phone || '+91 98480 00000',
    postedDate: jobData.postedDate || 'Today',
    description: jobData.description || 'Immediate vacancy available in Korutla.',
    requirements: jobData.requirements && jobData.requirements.length > 0 ? jobData.requirements : ['Punctual & Hardworking'],
    isVerified: jobData.isVerified ?? true,
    isFeatured: jobData.isFeatured ?? false,
    badgeLabel: jobData.badgeLabel || 'URGENT HIRING',
    badgeColor: jobData.badgeColor || 'emerald',
    cardColorTheme: jobData.cardColorTheme || 'blue',
  };

  jobsStore = [newJob, ...jobsStore];
  return newJob;
}

/**
 * Update an existing job listing
 */
export function updateJob(id: string, updates: Partial<JobListing>): JobListing | null {
  const index = jobsStore.findIndex((j) => j.id === id);
  if (index === -1) return null;

  jobsStore[index] = {
    ...jobsStore[index],
    ...updates,
  };

  return jobsStore[index];
}

/**
 * Delete a job listing by ID
 */
export function deleteJob(id: string): boolean {
  const initialLength = jobsStore.length;
  jobsStore = jobsStore.filter((j) => j.id !== id);
  return jobsStore.length < initialLength;
}
