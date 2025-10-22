import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import { ReservationStatus } from '@/types';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    await connectDB();
    
    const reservations = await Reservation.find()
      .populate('studentId', 'name email')
      .populate('bookId', 'title author')
      .populate('tableId', 'label')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(createApiResponse(reservations));
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, status } = body;

    if (!Object.values(ReservationStatus).includes(status)) {
      return NextResponse.json(createApiResponse(null, 'Invalid status'), { status: 400 });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('studentId', 'name email')
     .populate('bookId', 'title author')
     .populate('tableId', 'label');

    if (!reservation) {
      return NextResponse.json(createApiResponse(null, 'Reservation not found'), { status: 404 });
    }

    return NextResponse.json(createApiResponse(reservation, 'Reservation updated successfully'));
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
