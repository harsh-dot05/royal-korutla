import { NextResponse } from 'next/server';
import {
  getAllRepresentatives,
  getRepresentativesByRole,
  getWardCouncillors,
} from '@/lib/representativesStore';

export async function GET() {
  const mlaList = getRepresentativesByRole('MLA');
  const chairmanList = getRepresentativesByRole('MUNICIPAL_CHAIRMAN');
  const wardCouncillors = getWardCouncillors();
  const all = getAllRepresentatives();

  return NextResponse.json({
    success: true,
    data: {
      mla: mlaList[0] || null,
      chairman: chairmanList[0] || null,
      wardCouncillors,
      all,
      totalWards: 33,
    },
    message: 'Public representatives retrieved successfully',
  });
}
