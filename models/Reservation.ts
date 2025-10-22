import mongoose, { Schema, Document } from 'mongoose';

export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  WAITLISTED = 'WAITLISTED',
}

export interface ITimeSlot {
  startTime: string; // Format: "HH:MM" (24-hour format)
  endTime: string;   // Format: "HH:MM" (24-hour format)
}

export interface IReservation extends Document {
  _id: string;
  studentId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  tableId: mongoose.Types.ObjectId;
  seatNumber: number;
  reservedDate: Date;
  timeSlot: ITimeSlot;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TimeSlotSchema = new Schema<ITimeSlot>({
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'],
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'],
  },
}, { _id: false });

const ReservationSchema = new Schema<IReservation>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required'],
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required'],
  },
  tableId: {
    type: Schema.Types.ObjectId,
    ref: 'Table',
    required: [true, 'Table ID is required'],
  },
  seatNumber: {
    type: Number,
    required: [true, 'Seat number is required'],
    min: [1, 'Seat number must be at least 1'],
    max: [100, 'Seat number cannot exceed 100'],
  },
  reservedDate: {
    type: Date,
    required: [true, 'Reserved date is required'],
    min: [new Date(), 'Reserved date cannot be in the past'],
  },
  timeSlot: {
    type: TimeSlotSchema,
    required: [true, 'Time slot is required'],
  },
  status: {
    type: String,
    enum: Object.values(ReservationStatus),
    default: ReservationStatus.PENDING,
    required: true,
  },
}, {
  timestamps: true,
});

// Validate that end time is after start time
ReservationSchema.pre('save', function(next) {
  const startTime = this.timeSlot.startTime;
  const endTime = this.timeSlot.endTime;
  
  if (startTime && endTime) {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    if (end <= start) {
      return next(new Error('End time must be after start time'));
    }
  }
  
  next();
});

// Create compound index for efficient queries
ReservationSchema.index({ tableId: 1, seatNumber: 1, reservedDate: 1, 'timeSlot.startTime': 1 });
ReservationSchema.index({ studentId: 1, reservedDate: 1 });
ReservationSchema.index({ bookId: 1, status: 1 });

export default mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);
