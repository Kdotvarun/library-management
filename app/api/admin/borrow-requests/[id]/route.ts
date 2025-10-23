import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BorrowRequest from '@/models/BorrowRequest';
import { BorrowRequestStatus } from '@/types';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!Object.values(BorrowRequestStatus).includes(status)) {
      return NextResponse.json(
        createApiResponse(null, 'Invalid status', false),
        { status: 400 }
      );
    }

    const borrowRequest = await BorrowRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('studentId', 'name email')
     .populate('bookId', 'title author');

    if (!borrowRequest) {
      return NextResponse.json(
        createApiResponse(null, 'Borrow request not found', false),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createApiResponse(borrowRequest, 'Borrow request updated successfully')
    );
  } catch (error) {
    console.error('Error updating borrow request:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
