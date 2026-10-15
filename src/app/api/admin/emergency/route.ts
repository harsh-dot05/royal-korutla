import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/authServer';
import {
  getAllEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContactById,
} from '@/lib/emergencyStore';
import { EmergencyContact } from '@/types';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const contacts = getAllEmergencyContacts();
  return NextResponse.json({
    success: true,
    data: contacts,
    message: 'Admin emergency contacts retrieved',
  });
}

export async function POST(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body: Partial<EmergencyContact> = await request.json();

    if (!body.name || !body.phone || !body.category) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'MISSING_FIELDS' },
          message: 'Name, category, and phone number are required.',
        },
        { status: 400 }
      );
    }

    const created = addEmergencyContact({
      name: body.name.trim(),
      category: body.category,
      phone: body.phone.trim(),
      address: body.address ? body.address.trim() : 'Korutla',
      available24x7: Boolean(body.available24x7),
      isVerified: Boolean(body.isVerified ?? true),
      notes: body.notes ? body.notes.trim() : undefined,
      timing: body.timing ? body.timing.trim() : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: 'Emergency contact added successfully',
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error creating emergency contact';
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message }, message: 'Failed to create emergency contact' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body: Partial<EmergencyContact> & { id: string } = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_ID' }, message: 'Emergency contact ID is required' },
        { status: 400 }
      );
    }

    const existing = getEmergencyContactById(body.id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND' }, message: 'Emergency contact not found' },
        { status: 404 }
      );
    }

    const updated = updateEmergencyContact(body.id, {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.phone !== undefined && { phone: body.phone.trim() }),
      ...(body.address !== undefined && { address: body.address.trim() }),
      ...(body.available24x7 !== undefined && { available24x7: Boolean(body.available24x7) }),
      ...(body.isVerified !== undefined && { isVerified: Boolean(body.isVerified) }),
      ...(body.notes !== undefined && { notes: body.notes.trim() }),
      ...(body.timing !== undefined && { timing: body.timing.trim() }),
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Emergency contact record updated successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error updating emergency contact';
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message }, message: 'Failed to update emergency contact' },
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
        { success: false, error: { code: 'MISSING_ID' }, message: 'Emergency contact ID is required' },
        { status: 400 }
      );
    }

    const deleted = deleteEmergencyContact(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND' }, message: 'Emergency contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Emergency contact record deleted successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error deleting emergency contact';
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message }, message: 'Failed to delete emergency contact' },
      { status: 500 }
    );
  }
}
