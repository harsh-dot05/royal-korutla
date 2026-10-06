import { NextResponse } from 'next/server';
import { requireSuperAdminApi } from '@/lib/authServer';
import {
  getAllAdminUsers,
  createAdminUser,
  updateAdminUser,
  resetAdminPassword,
  deleteAdminUser,
} from '@/lib/adminStore';

/**
 * GET: Fetch all admin accounts (SUPER_ADMIN only)
 */
export async function GET(request: Request) {
  const authError = requireSuperAdminApi(request);
  if (authError) return authError;

  const users = getAllAdminUsers();
  return NextResponse.json({
    success: true,
    users,
  });
}

/**
 * POST: Create a new admin account (SUPER_ADMIN only)
 */
export async function POST(request: Request) {
  const authError = requireSuperAdminApi(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    const result = createAdminUser({ name, email, password, role });
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to create admin user.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Admin account for "${name}" created successfully.`,
      user: result.user,
      users: getAllAdminUsers(),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Failed to create admin user.' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update admin details or reset password (SUPER_ADMIN only)
 */
export async function PUT(request: Request) {
  const authError = requireSuperAdminApi(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { action, id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Admin User ID is required.' },
        { status: 400 }
      );
    }

    if (action === 'reset_password') {
      const { newPassword } = body;
      const result = resetAdminPassword(id, newPassword);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Admin password reset successfully.',
        users: getAllAdminUsers(),
      });
    }

    if (action === 'update') {
      const { name, email, role, is_active } = body;
      const result = updateAdminUser(id, { name, email, role, is_active });
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Admin account updated successfully.',
        user: result.user,
        users: getAllAdminUsers(),
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action specified.' },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Failed to update admin account.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove an admin account (SUPER_ADMIN only)
 */
export async function DELETE(request: Request) {
  const authError = requireSuperAdminApi(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Admin User ID is required.' },
      { status: 400 }
    );
  }

  const result = deleteAdminUser(id);
  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Admin account removed successfully.',
    users: getAllAdminUsers(),
  });
}
