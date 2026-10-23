import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/authServer';
import {
  getAllBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  toggleBannerActive,
  reorderBanners,
} from '@/lib/heroBannersStore';

function validateDestinationLink(link: string): boolean {
  if (!link || typeof link !== 'string') return false;
  const trimmed = link.trim();
  // Valid if internal route starting with / (e.g., /clothing, /food) or external https://
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
  if (/^https:\/\/[^\s$.?#].[^\s]*$/i.test(trimmed)) return true;
  return false;
}

function validateImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:image/')) return true;
  if (/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(trimmed)) return true;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
  return false;
}

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const banners = getAllBanners();
  return NextResponse.json({
    success: true,
    data: banners,
    count: banners.length,
  });
}

export async function POST(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, subtitle, image, mobileImage, badgeText, ctaText, ctaLink, businessId, isActive } = body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'INVALID_TITLE', message: 'Title must be at least 3 characters long.' },
        { status: 400 }
      );
    }

    if (!subtitle || typeof subtitle !== 'string' || subtitle.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'INVALID_SUBTITLE', message: 'Subtitle must be at least 5 characters long.' },
        { status: 400 }
      );
    }

    if (!validateImageUrl(image)) {
      return NextResponse.json(
        { success: false, error: 'INVALID_IMAGE', message: 'A valid banner image URL or uploaded file is required.' },
        { status: 400 }
      );
    }

    if (mobileImage && !validateImageUrl(mobileImage)) {
      return NextResponse.json(
        { success: false, error: 'INVALID_MOBILE_IMAGE', message: 'Invalid mobile image format.' },
        { status: 400 }
      );
    }

    if (!ctaText || typeof ctaText !== 'string' || ctaText.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'INVALID_CTA_TEXT', message: 'Button text is required.' },
        { status: 400 }
      );
    }

    if (!validateDestinationLink(ctaLink)) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_CTA_LINK',
          message: 'Destination link must be a valid path (e.g. /clothing, /food) or https:// URL.',
        },
        { status: 400 }
      );
    }

    const newBanner = addBanner({
      title: title.trim(),
      subtitle: subtitle.trim(),
      image: image.trim(),
      mobileImage: mobileImage ? mobileImage.trim() : undefined,
      badgeText: badgeText ? String(badgeText).trim() : 'ROYAL SPOTLIGHT',
      badgeColor: 'bg-[#E66A32]',
      ctaText: ctaText.trim(),
      ctaLink: ctaLink.trim(),
      businessId: businessId ? String(businessId).trim() : undefined,
      isActive: isActive !== false,
    });

    return NextResponse.json({
      success: true,
      data: newBanner,
      message: 'Hero banner created and published successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Failed to create hero banner.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { action, id, orderedIds, ...updates } = body;

    if (action === 'toggle' && id) {
      const toggled = toggleBannerActive(id);
      if (!toggled) {
        return NextResponse.json({ success: false, message: 'Banner not found.' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: toggled,
        message: `Banner ${toggled.isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    }

    if (action === 'reorder' && Array.isArray(orderedIds)) {
      const reordered = reorderBanners(orderedIds);
      return NextResponse.json({
        success: true,
        data: reordered,
        message: 'Banners reordered successfully.',
      });
    }

    if (!id) {
      return NextResponse.json({ success: false, message: 'Banner ID is required.' }, { status: 400 });
    }

    // Validate fields if provided in updates
    if (updates.ctaLink && !validateDestinationLink(updates.ctaLink)) {
      return NextResponse.json(
        { success: false, message: 'Destination link must start with / or https://' },
        { status: 400 }
      );
    }

    if (updates.image && !validateImageUrl(updates.image)) {
      return NextResponse.json({ success: false, message: 'Invalid image URL or data URI.' }, { status: 400 });
    }

    const updated = updateBanner(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Banner not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Banner updated successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Failed to update hero banner.' },
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
      return NextResponse.json({ success: false, message: 'Banner ID is required.' }, { status: 400 });
    }

    const success = deleteBanner(id);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Banner not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Hero banner deleted successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Failed to delete hero banner.' },
      { status: 500 }
    );
  }
}
