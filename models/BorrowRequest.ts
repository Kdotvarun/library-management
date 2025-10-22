import mongoose, { Schema, Document } from 'mongoose';

export enum BorrowRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

export interface IBorrowRequest extends Document {
  _id: string;
  studentId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  requestedFromDate: Date;
  requestedToDate: Date;
  status: BorrowRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowRequestSchema = new Schema<IBorrowRequest>({
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
  requestedFromDate: {
    type: Date,
    required: [true, 'Requested from date is required'],
    min: [new Date(), 'Requested from date cannot be in the past'],
  },
  requestedToDate: {
    type: Date,
    required: [true, 'Requested to date is required'],
    min: [new Date(), 'Requested to date cannot be in the past'],
  },
  status: {
    type: String,
    enum: Object.values(BorrowRequestStatus),
    default: BorrowRequestStatus.PENDING,
    required: true,
  },
}, {
  timestamps: true,
});

// Validate that to date is after from date
BorrowRequestSchema.pre('save', function(next) {
  if (this.requestedToDate <= this.requestedFromDate) {
    return next(new Error('Requested to date must be after requested from date'));
  }
  
  // Validate that the borrowing period is not too long (e.g., max 30 days)
  const maxBorrowDays = 30;
  const diffTime = this.requestedToDate.getTime() - this.requestedFromDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > maxBorrowDays) {
    return next(new Error(`Borrowing period cannot exceed ${maxBorrowDays} days`));
  }
  
  next();
});

// Create compound index for efficient queries
BorrowRequestSchema.index({ studentId: 1, status: 1 });
BorrowRequestSchema.index({ bookId: 1, status: 1 });
BorrowRequestSchema.index({ requestedFromDate: 1, requestedToDate: 1 });
BorrowRequestSchema.index({ status: 1, createdAt: 1 });

export default mongoose.models.BorrowRequest || mongoose.model<IBorrowRequest>('BorrowRequest', BorrowRequestSchema);
