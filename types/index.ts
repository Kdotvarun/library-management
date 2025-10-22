// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  WAITLISTED = 'WAITLISTED',
}

export enum BorrowRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

// Interfaces
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  reservations: string[];
  borrowedBooks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImageURL?: string;
  availabilityStatus: AvailabilityStatus;
  addedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  _id: string;
  label: string;
  seats: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  startTime: string; // Format: "HH:MM" (24-hour format)
  endTime: string;   // Format: "HH:MM" (24-hour format)
}

export interface Reservation {
  _id: string;
  studentId: string;
  bookId: string;
  tableId: string;
  seatNumber: number;
  reservedDate: Date;
  timeSlot: TimeSlot;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BorrowRequest {
  _id: string;
  studentId: string;
  bookId: string;
  requestedFromDate: Date;
  requestedToDate: Date;
  status: BorrowRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
