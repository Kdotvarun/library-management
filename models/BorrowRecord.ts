import mongoose, { Schema, Document } from 'mongoose';

export interface IBorrowRecord extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'borrowed' | 'returned' | 'overdue';
  fine?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowRecordSchema = new Schema<IBorrowRecord>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required'],
  },
  borrowDate: {
    type: Date,
    required: [true, 'Borrow date is required'],
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed',
  },
  fine: {
    type: Number,
    min: [0, 'Fine cannot be negative'],
    default: 0,
  },
}, {
  timestamps: true,
});

// Update status based on return date and due date
BorrowRecordSchema.pre('save', function(next) {
  if (this.returnDate) {
    this.status = 'returned';
  } else if (this.dueDate < new Date()) {
    this.status = 'overdue';
  }
  next();
});

export default mongoose.models.BorrowRecord || mongoose.model<IBorrowRecord>('BorrowRecord', BorrowRecordSchema);
