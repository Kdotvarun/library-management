import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import BorrowRequest from '@/models/BorrowRequest';
import Book from '@/models/Book';
import { authOptions } from '@/lib/auth';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        createApiResponse(null, 'Unauthorized', false),
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { bookId } = body;

    if (!bookId) {
      return NextResponse.json(
        createApiResponse(null, 'Book ID is required', false),
        { status: 400 }
      );
    }

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        createApiResponse(null, 'Book not found', false),
        { status: 404 }
      );
    }

    if (book.availabilityStatus !== 'AVAILABLE') {
      return NextResponse.json(
        createApiResponse(null, 'Book is not available for borrowing', false),
        { status: 400 }
      );
    }

    // Check if user already has a pending request for this book
    const existingRequest = await BorrowRequest.findOne({
      studentId: session.user.id,
      bookId: bookId,
      status: 'PENDING'
    });

    if (existingRequest) {
      return NextResponse.json(
        createApiResponse(null, 'You already have a pending request for this book', false),
        { status: 400 }
      );
    }

    // Create borrow request
    const borrowRequest = new BorrowRequest({
      studentId: session.user.id,
      bookId: bookId,
      requestedFromDate: new Date(),
      requestedToDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: 'PENDING'
    });

    await borrowRequest.save();

    return NextResponse.json(
      createApiResponse(borrowRequest, 'Borrow request submitted successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating borrow request:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
