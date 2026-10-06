import { NextResponse } from 'next/server';
import { PhotographyBusiness } from '@/types';
import { requireAdminApi } from '@/lib/authServer';
import {
  getAllPhotographyBusinesses,
  addPhotographyBusiness,
  updatePhotographyBusiness,
  deletePhotographyBusiness,
} from '@/lib/photographyStore';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const studios = getAllPhotographyBusinesses();
  return NextResponse.json({
    success: true,
    data: studios,
    message: 'Admin photography listings retrieved successfully',
  });
}

export async function POST(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body: Partial<PhotographyBusiness> = await request.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Studio name and phone number are required',
          error: { code: 'INVALID_REQUEST' },
        },
        { status: 400 }
      );
    }

    const newStudio = addPhotographyBusiness({
      name: body.name,
      profileImage: body.profileImage || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop&q=80',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
      location: body.location || 'Main Road, Korutla',
      landmark: body.landmark || 'Near Gandhi Statue, Korutla',
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      instagram: body.instagram || '@korutlaphotography',
      description: body.description || 'Professional photography and video studio in Korutla.',
      photographyTypes: body.photographyTypes || ['Wedding', 'Portrait', 'Events'],
      startingPrice: body.startingPrice || '₹15,000 / day',
      openingHours: body.openingHours || '09:00 AM - 09:00 PM',
      isVerified: body.isVerified ?? true,
      isFeatured: body.isFeatured ?? false,
      rating: body.rating || 5.0,
      reviewCount: body.reviewCount || 1,
      galleryImages: body.galleryImages || [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      ],
    });

    return NextResponse.json({
      success: true,
      data: newStudio,
      message: 'Photography studio created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create photography studio' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body: Partial<PhotographyBusiness> & { id: string } = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'Studio ID is required for update' },
        { status: 400 }
      );
    }

    const updated = updatePhotographyBusiness(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Photography studio not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Photography studio updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update photography studio' },
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
        { success: false, message: 'Studio ID is required' },
        { status: 400 }
      );
    }

    const removed = deletePhotographyBusiness(id);
    if (!removed) {
      return NextResponse.json(
        { success: false, message: 'Studio not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Photography studio deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete photography studio' },
      { status: 500 }
    );
  }
}
