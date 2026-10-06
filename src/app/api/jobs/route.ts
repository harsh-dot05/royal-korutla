import { NextResponse } from 'next/server';
import { getAllJobs } from '@/lib/jobsStore';

export async function GET() {
  const jobs = getAllJobs();
  return NextResponse.json({
    success: true,
    data: jobs,
    message: 'Job vacancies retrieved successfully',
  });
}
