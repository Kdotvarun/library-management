'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { Book, Table, TimeSlot } from '@/types';

interface ReservationFormData {
  bookId: string;
  tableId: string;
  seatNumber: number;
  reservedDate: string;
  timeSlot: TimeSlot;
}

export default function NewReservationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ReservationFormData>({
    bookId: '',
    tableId: '',
    seatNumber: 1,
    reservedDate: '',
    timeSlot: {
      startTime: '09:00',
      endTime: '11:00',
    },
  });

  const fetchData = useCallback(async () => {
    try {
      const [booksResponse, tablesResponse] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/tables'),
      ]);

      if (booksResponse.ok) {
        const booksData = await booksResponse.json();
        setBooks(booksData.data || []);
      }

      if (tablesResponse.ok) {
        const tablesData = await tablesResponse.json();
        setTables(tablesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast({ type: 'error', title: 'Error loading data' });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'STUDENT') {
      router.push('/unauthorized');
      return;
    }
    
    fetchData();
  }, [session, status, router, fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/student/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        addToast({ type: 'success', title: 'Reservation created successfully' });
        router.push('/student/reservations');
      } else {
        const error = await response.json();
        addToast({ type: 'error', title: error.message || 'Failed to create reservation' });
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      addToast({ type: 'error', title: 'Error creating reservation' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTableChange = (tableId: string) => {
    const selectedTable = tables.find(table => table._id === tableId);
    if (selectedTable) {
      setFormData({
        ...formData,
        tableId,
        seatNumber: selectedTable.seats[0] || 1,
      });
    }
  };

  const getAvailableSeats = () => {
    const selectedTable = tables.find(table => table._id === formData.tableId);
    return selectedTable ? selectedTable.seats : [];
  };

  const timeSlots = [
    { startTime: '09:00', endTime: '11:00', label: 'Morning (9:00 AM - 11:00 AM)' },
    { startTime: '11:00', endTime: '13:00', label: 'Late Morning (11:00 AM - 1:00 PM)' },
    { startTime: '13:00', endTime: '15:00', label: 'Afternoon (1:00 PM - 3:00 PM)' },
    { startTime: '15:00', endTime: '17:00', label: 'Late Afternoon (3:00 PM - 5:00 PM)' },
    { startTime: '17:00', endTime: '19:00', label: 'Evening (5:00 PM - 7:00 PM)' },
  ];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              New Reservation
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Reserve a study table for your book
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Book
              </label>
              <select
                required
                value={formData.bookId}
                onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose a book...</option>
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title} by {book.author}
                  </option>
                ))}
              </select>
            </div>

            {/* Table Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Table
              </label>
              <select
                required
                value={formData.tableId}
                onChange={(e) => handleTableChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose a table...</option>
                {tables.map((table) => (
                  <option key={table._id} value={table._id}>
                    {table.label} ({table.seats.length} seats)
                  </option>
                ))}
              </select>
            </div>

            {/* Seat Selection */}
            {formData.tableId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Seat
                </label>
                <select
                  required
                  value={formData.seatNumber}
                  onChange={(e) => setFormData({ ...formData, seatNumber: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {getAvailableSeats().map((seat) => (
                    <option key={seat} value={seat}>
                      Seat {seat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reservation Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.reservedDate}
                onChange={(e) => setFormData({ ...formData, reservedDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Slot
              </label>
              <select
                required
                value={`${formData.timeSlot.startTime}-${formData.timeSlot.endTime}`}
                onChange={(e) => {
                  const [startTime, endTime] = e.target.value.split('-');
                  setFormData({
                    ...formData,
                    timeSlot: { startTime, endTime },
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {timeSlots.map((slot) => (
                  <option key={`${slot.startTime}-${slot.endTime}`} value={`${slot.startTime}-${slot.endTime}`}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/student/reservations')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors"
              >
                {submitting ? 'Creating...' : 'Create Reservation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
