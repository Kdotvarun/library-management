import mongoose, { Schema, Document } from 'mongoose';

export interface ITable extends Document {
  _id: string;
  label: string;
  seats: number[];
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema = new Schema<ITable>({
  label: {
    type: String,
    required: [true, 'Table label is required'],
    trim: true,
    unique: true,
    minlength: [1, 'Table label must be at least 1 character'],
    maxlength: [50, 'Table label cannot exceed 50 characters'],
  },
  seats: [{
    type: Number,
    required: true,
    min: [1, 'Seat number must be at least 1'],
    max: [100, 'Seat number cannot exceed 100'],
  }],
}, {
  timestamps: true,
});

// Validate that seats array is not empty and contains unique values
TableSchema.pre('save', function(next) {
  if (this.seats.length === 0) {
    return next(new Error('Table must have at least one seat'));
  }
  
  const uniqueSeats = Array.from(new Set(this.seats));
  if (uniqueSeats.length !== this.seats.length) {
    return next(new Error('Seat numbers must be unique'));
  }
  
  // Sort seats for consistency
  this.seats.sort((a, b) => a - b);
  next();
});

export default mongoose.models.Table || mongoose.model<ITable>('Table', TableSchema);
