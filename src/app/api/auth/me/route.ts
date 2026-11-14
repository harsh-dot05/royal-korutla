import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/authServer';
import { findCustomerById, findCustomerByPhone } from '@/lib/customerStore';

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message: 'No active session found.',
        },
        { status: 401 }
      );
    }

    if (session.role === 'CUSTOMER') {
      const customer = session.id
        ? findCustomerById(session.id)
        : session.phone
        ? findCustomerByPhone(session.phone)
        : null;

      return NextResponse.json({
        success: true,
        authenticated: true,
        user: {
          id: customer ? customer.id : session.id,
          name: customer ? customer.name : session.name,
          phone: customer ? customer.phone : session.phone,
          role: 'CUSTOMER',
          userType: customer ? customer.userType : session.userType || 'KORUTLA_RESIDENT',
          wardNumber: customer ? customer.wardNumber : session.wardNumber,
          villageName: customer ? customer.villageName : session.villageName,
          points: customer ? customer.points : 100,
          createdAt: customer ? customer.createdAt : session.createdAt,
        },
      });
    }

    // Admin or Business Owner session
    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
        businessId: session.businessId,
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        message: 'Failed to verify session.',
      },
      { status: 500 }
    );
  }
}
