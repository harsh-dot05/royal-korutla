import { NextResponse } from 'next/server';
import { getAllEmergencyContacts } from '@/lib/emergencyStore';

export async function GET() {
  const contacts = getAllEmergencyContacts();
  return NextResponse.json({
    success: true,
    data: contacts,
    message: 'Emergency services and ambulance contacts retrieved',
  });
}
