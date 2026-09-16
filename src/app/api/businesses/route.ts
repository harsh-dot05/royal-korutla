import { NextResponse } from 'next/server';
import { FEATURED_BUSINESSES } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');

  let results = FEATURED_BUSINESSES;

  if (category && category !== 'all') {
    results = results.filter((b) => b.categorySlug === category);
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.subCategory.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    data: results,
    count: results.length,
    message: 'Businesses retrieved successfully',
  });
}
