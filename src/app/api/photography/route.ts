import { NextResponse } from 'next/server';
import { getAllPhotographyBusinesses } from '@/lib/photographyStore';

export async function GET() {
  const studios = getAllPhotographyBusinesses();
  return NextResponse.json({
    success: true,
    data: studios,
    message: 'Photography listings retrieved',
  });
}
