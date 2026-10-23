import { Category, CategorySlug } from '@/types';
import { CATEGORIES } from '@/data/mockData';

let categoriesStore: Category[] = JSON.parse(JSON.stringify(CATEGORIES));

export function getAllCategories(): Category[] {
  return categoriesStore;
}

export function getCategoryBySlug(slug: string): Category | null {
  return categoriesStore.find((c) => c.slug === slug) || null;
}

export function updateCategory(
  slug: string,
  updates: Partial<Omit<Category, 'id' | 'slug'>>
): Category | null {
  const index = categoriesStore.findIndex((c) => c.slug === slug);
  if (index === -1) return null;

  categoriesStore[index] = {
    ...categoriesStore[index],
    ...updates,
  };

  return categoriesStore[index];
}

export function toggleCategoryStatus(slug: string): Category | null {
  const index = categoriesStore.findIndex((c) => c.slug === slug);
  if (index === -1) return null;

  const current = categoriesStore[index].isActive !== false;
  categoriesStore[index].isActive = !current;
  return categoriesStore[index];
}
