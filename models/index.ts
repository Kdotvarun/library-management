// Export all models and their types
export { default as User, type IUser, UserRole } from './User';
export { default as Book, type IBook, AvailabilityStatus } from './Book';
export { default as Table, type ITable } from './Table';
export { default as Reservation, type IReservation, ReservationStatus, type ITimeSlot } from './Reservation';
export { default as BorrowRequest, type IBorrowRequest, BorrowRequestStatus } from './BorrowRequest';
