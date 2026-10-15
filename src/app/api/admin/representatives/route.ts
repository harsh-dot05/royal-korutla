import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/authServer';
import {
  getAllRepresentatives,
  updateRepresentative,
  addRepresentative,
  deleteRepresentative,
} from '@/lib/representativesStore';
import { PublicRepresentative } from '@/types';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const representatives = getAllRepresentatives();
  return NextResponse.json({
    success: true,
    data: representatives,
    message: 'Representatives retrieved successfully for admin',
  });
}

export async function PUT(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body: Partial<PublicRepresentative> & { id: string } = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_ID',
          message: 'Representative ID is required',
        },
        { status: 400 }
      );
    }

    const updated = updateRepresentative(body.id, {
      name: body.name !== undefined ? body.name.trim() : undefined,
      designation: body.designation,
      constituency: body.constituency,
      areaName: body.areaName,
      photoUrl: body.photoUrl,
      phone: body.phone,
      email: body.email,
      officeAddress: body.officeAddress,
      termPeriod: body.termPeriod,
      isVerified: Boolean(body.isVerified),
    });

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: 'NOT_FOUND',
          message: 'Representative record not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Representative record updated and saved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'INVALID_REQUEST',
        message: 'Failed to process update request: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body: Omit<PublicRepresentative, 'id' | 'updatedAt'> = await request.json();

    if (!body.role || !body.designation) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_FIELDS',
          message: 'Role and designation are required',
        },
        { status: 400 }
      );
    }

    const created = addRepresentative({
      ...body,
      name: body.name ? body.name.trim() : '',
      isVerified: Boolean(body.isVerified),
    });

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Representative added successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'INVALID_REQUEST',
        message: 'Failed to create record: ' + (error instanceof Error ? error.message : String(error)),
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
        {
          success: false,
          error: 'MISSING_ID',
          message: 'ID parameter is required',
        },
        { status: 400 }
      );
    }

    const success = deleteRepresentative(id);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'NOT_FOUND',
          message: 'Record not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Representative slot reset / deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'INVALID_REQUEST',
        message: 'Failed to delete record: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
