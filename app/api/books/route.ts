import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Book from '@/models/Book';
import { createApiResponse, createErrorResponse, handleApiError, validatePaginationParams } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const pagination = validatePaginationParams({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
    });
    
    const query = searchParams.get('search') 
      ? {
          $or: [
            { title: { $regex: searchParams.get('search'), $options: 'i' } },
            { author: { $regex: searchParams.get('search'), $options: 'i' } },
            { isbn: { $regex: searchParams.get('search'), $options: 'i' } },
          ],
        }
      : {};
    
    const skip = (pagination.page - 1) * pagination.limit;
    const sort: Record<string, 1 | -1> = {};
    sort[pagination.sortBy] = pagination.sortOrder === 'asc' ? 1 : -1;
    
    const [books, total] = await Promise.all([
      Book.find(query)
        .sort(sort)
        .skip(skip)
        .limit(pagination.limit)
        .lean(),
      Book.countDocuments(query),
    ]);
    
    return NextResponse.json({
      success: true,
      data: books,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNext: pagination.page < Math.ceil(total / pagination.limit),
        hasPrev: pagination.page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const book = new Book(body);
    await book.save();
    
    return NextResponse.json(createApiResponse(book, 'Book created successfully'), { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
