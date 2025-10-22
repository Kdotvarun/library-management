import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BorrowRequest from '@/models/BorrowRequest';
import Book from '@/models/Book';
import { BorrowRequestStatus } from '@/types';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    await connectDB();
    
    const borrowRequests = await BorrowRequest.find()
      .populate('studentId', 'name email')
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(createApiResponse(borrowRequests));
  } catch (error) {
    console.error('Error fetching borrow requests:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, status } = body;

    if (!Object.values(BorrowRequestStatus).includes(status)) {
      return NextResponse.json(createApiResponse(null, 'Invalid status'), { status: 400 });
    }

    const borrowRequest = await BorrowRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('studentId', 'name email')
     .populate('bookId', 'title author');

    if (!borrowRequest) {
      return NextResponse.json(createApiResponse(null, 'Borrow request not found'), { status: 404 });
    }

    // If approved, update book availability status
    if (status === BorrowRequestStatus.APPROVED) {
      await Book.findByIdAndUpdate(borrowRequest.bookId, {
        availabilityStatus: 'BORROWED'
      });
    }

    return NextResponse.json(createApiResponse(borrowRequest, 'Borrow request updated successfully'));
  } catch (error) {
    console.error('Error updating borrow request:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
