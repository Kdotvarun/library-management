import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import { authOptions } from '@/lib/auth';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        createApiResponse(null, 'Unauthorized', false),
        { status: 401 }
      );
    }

    await connectDB();
    
    const reservations = await Reservation.find({ studentId: session.user.id })
      .populate('bookId', 'title author')
      .populate('tableId', 'label')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      createApiResponse(reservations, 'Reservations fetched successfully')
    );
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}

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
    const { bookId, tableId, seatNumber, reservedDate, timeSlot } = body;

    // Validate required fields
    if (!bookId || !tableId || !seatNumber || !reservedDate || !timeSlot) {
      return NextResponse.json(
        createApiResponse(null, 'Missing required fields', false),
        { status: 400 }
      );
    }

    // Check if the seat is already reserved for the same date and time
    const existingReservation = await Reservation.findOne({
      tableId,
      seatNumber,
      reservedDate: new Date(reservedDate),
      'timeSlot.startTime': timeSlot.startTime,
      'timeSlot.endTime': timeSlot.endTime,
      status: { $in: ['PENDING', 'APPROVED'] }
    });

    if (existingReservation) {
      return NextResponse.json(
        createApiResponse(null, 'This seat is already reserved for the selected time slot', false),
        { status: 409 }
      );
    }

    const reservation = new Reservation({
      studentId: session.user.id,
      bookId,
      tableId,
      seatNumber,
      reservedDate: new Date(reservedDate),
      timeSlot,
      status: 'PENDING'
    });

    await reservation.save();

    return NextResponse.json(
      createApiResponse(reservation, 'Reservation created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
