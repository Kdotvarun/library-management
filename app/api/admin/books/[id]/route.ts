import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Book from '@/models/Book';
import { authOptions } from '@/lib/auth';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        createApiResponse(null, 'Unauthorized', false),
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const book = await Book.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return NextResponse.json(
        createApiResponse(null, 'Book not found', false),
        { status: 404 }
      );
    }
    
    return NextResponse.json(createApiResponse(book, 'Book updated successfully'));
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        createApiResponse(null, 'Unauthorized', false),
        { status: 401 }
      );
    }

    await connectDB();
    
    const book = await Book.findByIdAndDelete(params.id);
    
    if (!book) {
      return NextResponse.json(
        createApiResponse(null, 'Book not found', false),
        { status: 404 }
      );
    }
    
    return NextResponse.json(createApiResponse(null, 'Book deleted successfully'));
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
