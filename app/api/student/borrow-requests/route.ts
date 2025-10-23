import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import BorrowRequest from '@/models/BorrowRequest';
import { authOptions } from '@/lib/auth';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        createApiResponse(null, 'Unauthorized', false),
        { status: 401 }
      );
    }

    await connectDB();
    
    const borrowRequests = await BorrowRequest.find({ studentId: session.user.id })
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(createApiResponse(borrowRequests));
  } catch (error) {
    console.error('Error fetching borrow requests:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
