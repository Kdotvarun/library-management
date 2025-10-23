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
    
    const [
      totalBooks,
      totalUsers,
      totalReservations,
      totalBorrowRequests,
      availableBooks,
      borrowedBooks,
      reservedBooks,
      maintenanceBooks,
      pendingReservations,
      approvedReservations,
      pendingBorrowRequests,
      approvedBorrowRequests,
      recentReservations,
      recentBorrowRequests
    ] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments(),
      Reservation.countDocuments(),
      BorrowRequest.countDocuments(),
      Book.countDocuments({ availabilityStatus: 'AVAILABLE' }),
      Book.countDocuments({ availabilityStatus: 'BORROWED' }),
      Book.countDocuments({ availabilityStatus: 'RESERVED' }),
      Book.countDocuments({ availabilityStatus: 'MAINTENANCE' }),
      Reservation.countDocuments({ status: 'PENDING' }),
      Reservation.countDocuments({ status: 'APPROVED' }),
      BorrowRequest.countDocuments({ status: 'PENDING' }),
      BorrowRequest.countDocuments({ status: 'APPROVED' }),
      Reservation.find().sort({ createdAt: -1 }).limit(5).populate('studentId', 'name').populate('bookId', 'title'),
      BorrowRequest.find().sort({ createdAt: -1 }).limit(5).populate('studentId', 'name').populate('bookId', 'title')
    ]);

    // Create recent activity
    const recentActivity = [
      ...recentReservations.map(r => ({
        type: 'reservation',
        description: `${r.studentId.name} reserved ${r.bookId.title}`,
        timestamp: r.createdAt
      })),
      ...recentBorrowRequests.map(b => ({
        type: 'borrow',
        description: `${b.studentId.name} requested ${b.bookId.title}`,
        timestamp: b.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    const stats = {
      totalBooks,
      totalUsers,
      totalReservations,
      totalBorrowRequests,
      availableBooks,
      borrowedBooks,
      reservedBooks,
      maintenanceBooks,
      pendingReservations,
      approvedReservations,
      pendingBorrowRequests,
      approvedBorrowRequests,
      recentActivity
    };

    return NextResponse.json(createApiResponse(stats));
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
