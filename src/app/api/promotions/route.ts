import { NextResponse } from 'next/server';
import { getActivePromotions } from '@/lib/promotionsStore';

export async function GET() {
  const activePromotions = getActivePromotions();

  return NextResponse.json({
    success: true,
    data: activePromotions,
    message: 'Active promotions retrieved successfully',
  });
}
