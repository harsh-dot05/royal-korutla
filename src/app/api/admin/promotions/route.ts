import { NextResponse } from 'next/server';
import { Promotion } from '@/types';
import { requireAdminApi } from '@/lib/auth';
import { getAllPromotions, addPromotion, deletePromotion } from '@/lib/promotionsStore';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const promotions = getAllPromotions();

  return NextResponse.json({
    success: true,
    data: promotions,
    message: 'Admin promotions list retrieved',
  });
}

export async function POST(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body: Partial<Promotion> = await request.json();

    if (!body.businessName || !body.promotionType) {
      return NextResponse.json(
        {
          success: false,
          message: 'businessName and promotionType are required fields',
          error: { code: 'INVALID_REQUEST' },
        },
        { status: 400 }
      );
    }

    const newPromotion = addPromotion({
      businessId: body.businessId || `biz-${Date.now()}`,
      businessName: body.businessName,
      promotionType: body.promotionType,
      placement: body.placement || 'Homepage Top Banner',
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      endDate: body.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      priority: body.priority || 1,
      status: 'ACTIVE',
      badgeLabel: body.badgeLabel || 'PROMOTED',
      bannerImage: body.bannerImage,
      title: body.title,
      description: body.description,
      offerText: body.offerText,
    });

    return NextResponse.json({
      success: true,
      data: newPromotion,
      message: 'Promotion created and published successfully live on Royal Korutla 👑',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create promotion',
        error: { code: 'SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Promotion ID is required' },
        { status: 400 }
      );
    }

    const removed = deletePromotion(id);
    if (!removed) {
      return NextResponse.json(
        { success: false, message: 'Promotion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Promotion deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete promotion' },
      { status: 500 }
    );
  }
}
