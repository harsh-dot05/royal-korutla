import { NextResponse } from 'next/server';
import { JobListing } from '@/types';
import { requireAdminApi } from '@/lib/auth';
import { getAllJobs, addJob, updateJob, deleteJob } from '@/lib/jobsStore';

export async function GET(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const jobs = getAllJobs();
  return NextResponse.json({
    success: true,
    data: jobs,
    message: 'Admin job listings retrieved',
  });
}

export async function POST(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body: Partial<JobListing> = await request.json();

    if (!body.title || !body.shopName) {
      return NextResponse.json(
        {
          success: false,
          message: 'Job Title and Shop / Business Name are required fields',
        },
        { status: 400 }
      );
    }

    const createdJob = addJob({
      title: body.title,
      category: body.category || 'General Jobs',
      shopName: body.shopName,
      location: body.location || 'Korutla Town',
      salary: body.salary || 'Negotiable',
      type: body.type || 'Full-time',
      experience: body.experience || 'Freshers / Experienced',
      phone: body.phone || '+91 98480 00000',
      whatsapp: body.whatsapp || body.phone,
      postedDate: 'Just now',
      description: body.description || 'Job opening in Korutla.',
      requirements: body.requirements || [],
      isVerified: body.isVerified ?? true,
      isFeatured: body.isFeatured ?? false,
      badgeLabel: body.badgeLabel || 'URGENT HIRING',
      badgeColor: body.badgeColor || 'emerald',
      cardColorTheme: body.cardColorTheme || 'blue',
    });

    return NextResponse.json({
      success: true,
      data: createdJob,
      message: `Job vacancy "${createdJob.title}" added and styled successfully! 👑`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create job listing' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const body: Partial<JobListing> & { id: string } = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required for editing' },
        { status: 400 }
      );
    }

    const updated = updateJob(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Job listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Job vacancy "${updated.title}" updated successfully! 🎨`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update job listing' },
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
        { success: false, message: 'Job ID is required' },
        { status: 400 }
      );
    }

    const removed = deleteJob(id);
    if (!removed) {
      return NextResponse.json(
        { success: false, message: 'Job listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job vacancy removed successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete job listing' },
      { status: 500 }
    );
  }
}
