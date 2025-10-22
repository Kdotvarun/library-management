import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Book from '@/models/Book';
import { AvailabilityStatus } from '@/types';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    await connectDB();
    
    const books = await Book.find()
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(createApiResponse(books));
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, author, genre, description, coverImageURL, addedBy } = body;

    const book = new Book({
      title,
      author,
      genre,
      description,
      coverImageURL,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      addedBy,
    });

    await book.save();
    await book.populate('addedBy', 'name email');

    return NextResponse.json(createApiResponse(book, 'Book created successfully'), { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, availabilityStatus } = body;

    const book = await Book.findByIdAndUpdate(
      id,
      { availabilityStatus },
      { new: true }
    ).populate('addedBy', 'name email');

    if (!book) {
      return NextResponse.json(createApiResponse(null, 'Book not found'), { status: 404 });
    }

    return NextResponse.json(createApiResponse(book, 'Book updated successfully'));
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(createApiResponse(null, 'Book ID is required'), { status: 400 });
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return NextResponse.json(createApiResponse(null, 'Book not found'), { status: 404 });
    }

    return NextResponse.json(createApiResponse(null, 'Book deleted successfully'));
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
