import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/authServer';
import {
  getAllCommunityPhotosAdmin,
  addCommunityPhoto,
  updateCommunityPhoto,
  deleteCommunityPhoto,
  getCommunityPhotoById,
  COMMUNITY_PHOTO_CATEGORIES,
} from '@/lib/communityPhotographyStore';
import { CommunityPhotoCategory, CommunityPhotoStatus } from '@/types';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') as CommunityPhotoStatus | 'ALL') || 'ALL';
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const photos = getAllCommunityPhotosAdmin({ status, category, search });

    const counts = {
      total: photos.length,
      pending: photos.filter((p) => p.status === 'PENDING').length,
      approved: photos.filter((p) => p.status === 'APPROVED').length,
      published: photos.filter((p) => p.isPublished).length,
      rejected: photos.filter((p) => p.status === 'REJECTED').length,
    };

    return NextResponse.json({
      success: true,
      data: photos,
      counts,
      categories: COMMUNITY_PHOTO_CATEGORIES,
      message: 'Admin community photographs retrieved successfully',
    });
  } catch (error) {
    console.error('Admin photo retrieval error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Failed to retrieve admin photos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!body.title?.trim() || !body.imageUrl?.trim() || !body.photographerName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Photo title, image URL, and photographer name are required.',
        },
        { status: 400 }
      );
    }

    if (!COMMUNITY_PHOTO_CATEGORIES.includes(body.category)) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: `Category must be one of: ${COMMUNITY_PHOTO_CATEGORIES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Require explicit permission confirmation if setting to approved/published
    if (body.isPublished && !body.permissionConfirmed) {
      return NextResponse.json(
        {
          success: false,
          error: 'PERMISSION_REQUIRED',
          message: 'Explicit publication permission must be recorded before publishing any community photograph.',
        },
        { status: 400 }
      );
    }

    const created = addCommunityPhoto({
      title: body.title,
      category: body.category as CommunityPhotoCategory,
      imageUrl: body.imageUrl,
      altText: body.altText || body.title,
      photographerName: body.photographerName,
      caption: body.caption,
      location: body.location,
      instagram: body.instagram,
      portfolioUrl: body.portfolioUrl,
      status: body.status || 'PENDING',
      permissionConfirmed: Boolean(body.permissionConfirmed),
      permissionNotes: body.permissionNotes,
      isPublished: Boolean(body.isPublished),
      featuredOnHome: Boolean(body.featuredOnHome),
    });

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Community photograph recorded successfully.',
    });
  } catch (error) {
    console.error('Admin photo creation error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Failed to record community photograph' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'MISSING_ID', message: 'Photo ID is required for update.' },
        { status: 400 }
      );
    }

    const existing = getCommunityPhotoById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND', message: 'Photograph not found.' },
        { status: 404 }
      );
    }

    // If publishing, verify that permission is confirmed or being confirmed in this update
    const willBePublished = body.isPublished !== undefined ? body.isPublished : existing.isPublished;
    const hasPermission = body.permissionConfirmed !== undefined ? body.permissionConfirmed : existing.permissionConfirmed;
    const nextStatus = body.status !== undefined ? body.status : existing.status;

    if (willBePublished && (!hasPermission || nextStatus !== 'APPROVED')) {
      return NextResponse.json(
        {
          success: false,
          error: 'PERMISSION_REQUIRED',
          message: 'A photograph can only be published when its status is APPROVED and explicit publication permission has been recorded.',
        },
        { status: 400 }
      );
    }

    const updated = updateCommunityPhoto(id, body);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Community photograph updated successfully.',
    });
  } catch (error) {
    console.error('Admin photo update error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Failed to update community photograph' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch (e) {
        // No body provided
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'MISSING_ID', message: 'Photo ID is required for deletion.' },
        { status: 400 }
      );
    }

    const deleted = deleteCommunityPhoto(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND', message: 'Photograph not found or already deleted.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Community photograph deleted successfully.',
    });
  } catch (error) {
    console.error('Admin photo delete error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Failed to delete community photograph' },
      { status: 500 }
    );
  }
}
