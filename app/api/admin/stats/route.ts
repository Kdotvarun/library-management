import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Book from '@/models/Book';
import User from '@/models/User';
import BorrowRequest from '@/models/BorrowRequest';
import Reservation from '@/models/Reservation';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    await connectDB();
    
    const [totalBooks, pendingBorrowRequests, pendingReservations, activeStudents] = await Promise.all([
      Book.countDocuments(),
      BorrowRequest.countDocuments({ status: 'PENDING' }),
      Reservation.countDocuments({ status: 'PENDING' }),
      User.countDocuments({ role: 'STUDENT' }),
    ]);

    const stats = {
      totalBooks,
      pendingBorrowRequests,
      pendingReservations,
      activeStudents,
    };

    return NextResponse.json(createApiResponse(stats));
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
