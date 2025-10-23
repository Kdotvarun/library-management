import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import { ReservationStatus } from '@/types';
import { createApiResponse, handleApiError } from '@/lib/api-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!Object.values(ReservationStatus).includes(status)) {
      return NextResponse.json(
        createApiResponse(null, 'Invalid status', false),
        { status: 400 }
      );
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('studentId', 'name email')
     .populate('bookId', 'title author')
     .populate('tableId', 'label');

    if (!reservation) {
      return NextResponse.json(
        createApiResponse(null, 'Reservation not found', false),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createApiResponse(reservation, 'Reservation updated successfully')
    );
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
