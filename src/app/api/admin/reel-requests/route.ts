import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/authServer';
import {
  getAllReelRequests,
  updateReelRequest,
  deleteReelRequest,
  getReelRequestById,
} from '@/lib/reelRequestsStore';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const requests = getAllReelRequests();
  return NextResponse.json({
    success: true,
    data: requests,
    message: 'Admin reel requests retrieved successfully',
  });
}

export async function PATCH(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, status, adminNotes, followUpDate } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'MISSING_ID' },
          message: 'Reel request ID is required',
        },
        { status: 400 }
      );
    }

    const existing = getReelRequestById(id);
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND' },
          message: 'Reel request not found',
        },
        { status: 404 }
      );
    }

    const updated = updateReelRequest(id, {
      ...(status !== undefined && { status }),
      ...(adminNotes !== undefined && { adminNotes: adminNotes.trim() }),
      ...(followUpDate !== undefined && { followUpDate: followUpDate.trim() }),
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Reel request status and follow-up notes updated successfully.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update reel request';
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message },
        message: 'Failed to update reel request.',
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
          error: { code: 'MISSING_ID' },
          message: 'Reel request ID is required',
        },
        { status: 400 }
      );
    }

    const deleted = deleteReelRequest(id);
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND' },
          message: 'Reel request not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reel request deleted successfully.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete reel request';
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message },
        message: 'Failed to delete reel request.',
      },
      { status: 500 }
    );
  }
}
