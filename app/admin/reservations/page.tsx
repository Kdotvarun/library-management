'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/components/Toast';
import { ReservationStatus } from '@/types';

interface Reservation {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  bookId: {
    _id: string;
    title: string;
    author: string;
  };
  tableId: {
    _id: string;
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

export default function ReservationsPage() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReservationStatus | 'ALL'>('ALL');

  const fetchReservations = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/reservations');
      if (response.ok) {
        const data = await response.json();
        setReservations(data.data || []);
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch reservations'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch reservations'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleStatusUpdate = async (reservationId: string, newStatus: ReservationStatus) => {
    try {
      const response = await fetch(`/api/admin/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'Success',
          message: `Reservation ${newStatus.toLowerCase()} successfully`
        });
        fetchReservations();
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to update reservation status'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update reservation status'
      });
    }
  };

  const filteredReservations = filter === 'ALL' 
    ? reservations 
    : reservations.filter(reservation => reservation.status === filter);

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case ReservationStatus.APPROVED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case ReservationStatus.DENIED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case ReservationStatus.WAITLISTED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Study Reservations
          </h1>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as ReservationStatus | 'ALL')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="ALL">All Reservations</option>
              <option value={ReservationStatus.PENDING}>Pending</option>
              <option value={ReservationStatus.APPROVED}>Approved</option>
              <option value={ReservationStatus.DENIED}>Denied</option>
              <option value={ReservationStatus.WAITLISTED}>Waitlisted</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
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
                    Table & Seat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date & Time
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
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {reservation.studentId.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {reservation.studentId.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {reservation.bookId.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          by {reservation.bookId.author}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {reservation.tableId.label} - Seat {reservation.seatNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>
                        <div>{new Date(reservation.reservedDate).toLocaleDateString()}</div>
                        <div>{reservation.timeSlot.startTime} - {reservation.timeSlot.endTime}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {reservation.status === ReservationStatus.PENDING && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(reservation._id, ReservationStatus.APPROVED)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(reservation._id, ReservationStatus.DENIED)}
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
          {filteredReservations.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No reservations found
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
