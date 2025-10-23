import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import { authOptions } from '@/lib/auth';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        createApiResponse(null, 'Unauthorized', false),
        { status: 401 }
      );
    }

    await connectDB();
    
    const reservations = await Reservation.find({ studentId: session.user.id })
      .populate('bookId', 'title author')
      .populate('tableId', 'label')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      createApiResponse(reservations, 'Reservations fetched successfully')
    );
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
