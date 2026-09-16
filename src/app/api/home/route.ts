import { NextResponse } from 'next/server';
import {
  HERO_SLIDES,
  TODAY_ITEMS,
  FEATURED_BUSINESSES,
  FEATURED_OFFERS,
  EMERGENCY_CONTACTS,
  CATEGORIES,
} from '@/data/mockData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        slider: HERO_SLIDES,
        todayInKorutla: TODAY_ITEMS,
        featuredBusinesses: FEATURED_BUSINESSES,
        offers: FEATURED_OFFERS,
        emergencyContacts: EMERGENCY_CONTACTS,
        categories: CATEGORIES,
      },
      message: 'Royal Korutla Homepage Payload',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch homepage payload',
        error: { code: 'INTERNAL_ERROR' },
      },
      { status: 500 }
    );
  }
}
