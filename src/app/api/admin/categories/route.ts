import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/authServer';
import { getAllCategories, updateCategory, toggleCategoryStatus } from '@/lib/categoriesStore';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  return NextResponse.json({
    success: true,
    data: getAllCategories(),
    message: 'Categories retrieved successfully.',
  });
}

export async function PUT(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { slug, action, updates } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'MISSING_SLUG', message: 'Category slug is required.' },
        { status: 400 }
      );
    }

    if (action === 'toggle_status') {
      const updated = toggleCategoryStatus(slug);
      return NextResponse.json({
        success: true,
        data: updated,
        message: `Category ${slug} status toggled.`,
      });
    }

    const updated = updateCategory(slug, updates || {});
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND', message: 'Category not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Category ${updated.name} updated successfully.`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Failed to update category.' },
      { status: 500 }
    );
  }
}
