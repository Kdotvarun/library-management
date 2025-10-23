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
    
    console.log('🔐 Session check:', { 
      hasSession: !!session, 
      hasUser: !!session?.user, 
      userId: session?.user?.id, 
      role: session?.user?.role 
    });
    
    if (!session?.user?.id) {
      console.log('❌ No session or user ID');
      return NextResponse.json(
        createApiResponse(null, 'Unauthorized', false),
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    console.log('📝 Request body:', body);
    const { bookId } = body;

    if (!bookId) {
      console.log('❌ Book ID is required');
      return NextResponse.json(
        createApiResponse(null, 'Book ID is required', false),
        { status: 400 }
      );
    }

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      console.log('❌ Book not found:', bookId);
      return NextResponse.json(
        createApiResponse(null, 'Book not found', false),
        { status: 404 }
      );
    }

    if (book.availabilityStatus !== 'AVAILABLE') {
      console.log('❌ Book is not available:', book.availabilityStatus);
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
      console.log('❌ User already has pending request for this book');
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

    console.log('💾 Saving borrow request:', borrowRequest);
    await borrowRequest.save();
    console.log('✅ Borrow request saved successfully');

    return NextResponse.json(
      createApiResponse(borrowRequest, 'Borrow request submitted successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error creating borrow request:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
