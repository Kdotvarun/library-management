'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/components/Toast';
import { AvailabilityStatus, BorrowRequestStatus, ReservationStatus } from '@/types';

interface AdminStats {
  totalBooks: number;
  pendingBorrowRequests: number;
  pendingReservations: number;
  activeStudents: number;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImageURL?: string;
  availabilityStatus: AvailabilityStatus;
  addedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface BorrowRequest {
  _id: string;
  studentId: {
    name: string;
    email: string;
  };
  bookId: {
    title: string;
    author: string;
  };
  requestedFromDate: string;
  requestedToDate: string;
  status: BorrowRequestStatus;
  createdAt: string;
}

interface Reservation {
  _id: string;
  studentId: {
    name: string;
    email: string;
  };
  bookId: {
    title: string;
    author: string;
  };
  tableId: {
    label: string;
  };
  seatNumber: number;
  reservedDate: string;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  status: ReservationStatus;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, booksRes, borrowRequestsRes, reservationsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/books'),
          fetch('/api/admin/borrow-requests'),
          fetch('/api/admin/reservations'),
        ]);

        const [statsData, booksData, borrowRequestsData, reservationsData] = await Promise.all([
          statsRes.json(),
          booksRes.json(),
          borrowRequestsRes.json(),
          reservationsRes.json(),
        ]);

        if (statsData.success) setStats(statsData.data);
        if (booksData.success) setBooks(booksData.data);
        if (borrowRequestsData.success) setBorrowRequests(borrowRequestsData.data);
        if (reservationsData.success) setReservations(reservationsData.data);
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch data',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addToast]);

  // Update book availability status
  const updateBookStatus = async (bookId: string, status: AvailabilityStatus) => {
    try {
      const response = await fetch('/api/admin/books', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookId, availabilityStatus: status }),
      });

      const data = await response.json();
      
      if (data.success) {
        setBooks(prev => prev.map(book => 
          book._id === bookId ? { ...book, availabilityStatus: status } : book
        ));
        addToast({
          type: 'success',
          title: 'Success',
          message: 'Book status updated successfully',
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update book status',
      });
    }
  };

  // Delete book
  const deleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`/api/admin/books?id=${bookId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setBooks(prev => prev.filter(book => book._id !== bookId));
        addToast({
          type: 'success',
          title: 'Success',
          message: 'Book deleted successfully',
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete book',
      });
    }
  };

  // Update borrow request status
  const updateBorrowRequestStatus = async (requestId: string, status: BorrowRequestStatus) => {
    try {
      const response = await fetch('/api/admin/borrow-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: requestId, status }),
      });

      const data = await response.json();
      
      if (data.success) {
        setBorrowRequests(prev => prev.map(req => 
          req._id === requestId ? { ...req, status } : req
        ));
        addToast({
          type: 'success',
          title: 'Success',
          message: `Borrow request ${status.toLowerCase()} successfully`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update borrow request',
      });
    }
  };

  // Update reservation status
  const updateReservationStatus = async (reservationId: string, status: ReservationStatus) => {
    try {
      const response = await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reservationId, status }),
      });

      const data = await response.json();
      
      if (data.success) {
        setReservations(prev => prev.map(res => 
          res._id === reservationId ? { ...res, status } : res
        ));
        addToast({
          type: 'success',
          title: 'Success',
          message: `Reservation ${status.toLowerCase()} successfully`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update reservation',
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back, {session?.user?.name}. Manage your library system.
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📚</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total Books
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.totalBooks}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📖</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Pending Borrow Requests
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.pendingBorrowRequests}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Pending Table Reservations
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.pendingReservations}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Active Students
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.activeStudents}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Books Management Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Books Management
            </h3>
            <button
              onClick={() => setShowAddBookModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Add Book
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cover
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {book.coverImageURL ? (
                        <Image
                          className="h-10 w-10 rounded-lg object-cover"
                          src={book.coverImageURL}
                          alt={book.title}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-sm">📚</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {book.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {book.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {book.genre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={book.availabilityStatus}
                        onChange={(e) => updateBookStatus(book._id, e.target.value as AvailabilityStatus)}
                        className="text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value={AvailabilityStatus.AVAILABLE}>Available</option>
                        <option value={AvailabilityStatus.BORROWED}>Borrowed</option>
                        <option value={AvailabilityStatus.RESERVED}>Reserved</option>
                        <option value={AvailabilityStatus.MAINTENANCE}>Maintenance</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => deleteBook(book._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Borrow Requests Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Borrow Requests
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    From Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    To Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {borrowRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.studentId.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {request.studentId.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.bookId.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        by {request.bookId.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(request.requestedFromDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(request.requestedToDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === BorrowRequestStatus.PENDING
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : request.status === BorrowRequestStatus.APPROVED
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {request.status === BorrowRequestStatus.PENDING && (
                        <>
                          <button
                            onClick={() => updateBorrowRequestStatus(request._id, BorrowRequestStatus.APPROVED)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateBorrowRequestStatus(request._id, BorrowRequestStatus.DENIED)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Deny
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Reservations Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Table Reservations
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Seat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Time Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reservations.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.studentId.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {reservation.studentId.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reservation.tableId.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reservation.seatNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(reservation.reservedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reservation.timeSlot.startTime} - {reservation.timeSlot.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reservation.status === ReservationStatus.PENDING
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : reservation.status === ReservationStatus.APPROVED
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : reservation.status === ReservationStatus.WAITLISTED
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {reservation.status === ReservationStatus.PENDING && (
                        <>
                          <button
                            onClick={() => updateReservationStatus(reservation._id, ReservationStatus.APPROVED)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateReservationStatus(reservation._id, ReservationStatus.WAITLISTED)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Waitlist
                          </button>
                          <button
                            onClick={() => updateReservationStatus(reservation._id, ReservationStatus.DENIED)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Deny
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Book Modal */}
        {showAddBookModal && (
          <AddBookModal
            onClose={() => setShowAddBookModal(false)}
            onBookAdded={(newBook) => {
              setBooks(prev => [newBook, ...prev]);
              setShowAddBookModal(false);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}

// Add Book Modal Component
function AddBookModal({ onClose, onBookAdded }: { onClose: () => void; onBookAdded: (book: Book) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    coverImageURL: '',
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          addedBy: 'admin', // In a real app, get this from session
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        onBookAdded(data.data);
        addToast({
          type: 'success',
          title: 'Success',
          message: 'Book added successfully',
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to add book',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New Book
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Author
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Genre
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.coverImageURL}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverImageURL: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Book'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
