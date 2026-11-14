import { NextResponse } from 'next/server';
import {
  getPublishedCommunityPhotos,
  getFeaturedCommunityPhotos,
  COMMUNITY_PHOTO_CATEGORIES,
} from '@/lib/communityPhotographyStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const featuredOnly = searchParams.get('featured') === 'true';

    const photos = featuredOnly
      ? getFeaturedCommunityPhotos(Number(searchParams.get('limit')) || 6)
      : getPublishedCommunityPhotos(category);

    return NextResponse.json({
      success: true,
      data: photos,
      categories: COMMUNITY_PHOTO_CATEGORIES,
      totalCount: photos.length,
      message: 'Published community photographs retrieved',
    });
  } catch (error) {
    console.error('Failed to retrieve community photos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Unable to retrieve community photographs at this moment.',
      },
      { status: 500 }
    );
  }
}
