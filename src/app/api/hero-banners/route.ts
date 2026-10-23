import { NextResponse } from 'next/server';
import { getActiveBanners } from '@/lib/heroBannersStore';

export async function GET() {
  try {
    const banners = getActiveBanners();
    return NextResponse.json({
      success: true,
      data: banners,
      count: banners.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'FETCH_ERROR', message: 'Failed to load active hero banners' },
      { status: 500 }
    );
  }
}
