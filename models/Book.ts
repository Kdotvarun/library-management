import mongoose, { Schema, Document } from 'mongoose';

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
}

export interface IBook extends Document {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImageURL?: string;
  availabilityStatus: AvailabilityStatus;
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    minlength: [1, 'Author must be at least 1 character'],
    maxlength: [100, 'Author cannot exceed 100 characters'],
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    minlength: [1, 'Genre must be at least 1 character'],
    maxlength: [50, 'Genre cannot exceed 50 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  coverImageURL: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i, 'Please enter a valid image URL'],
  },
  availabilityStatus: {
    type: String,
    enum: Object.values(AvailabilityStatus),
    default: AvailabilityStatus.AVAILABLE,
    required: true,
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Added by user is required'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
