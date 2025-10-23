'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/components/Toast';
import { BorrowRequestStatus } from '@/types';

interface BorrowRequest {
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
  requestedFromDate: string;
  requestedToDate: string;
  status: BorrowRequestStatus;
  createdAt: string;
}

export default function BorrowRequestsPage() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BorrowRequestStatus | 'ALL'>('ALL');

  const fetchBorrowRequests = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/borrow-requests');
      if (response.ok) {
        const data = await response.json();
        setBorrowRequests(data.data || []);
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch borrow requests'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch borrow requests'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchBorrowRequests();
  }, [fetchBorrowRequests]);

  const handleStatusUpdate = async (requestId: string, newStatus: BorrowRequestStatus) => {
    try {
      const response = await fetch(`/api/admin/borrow-requests/${requestId}`, {
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
          message: `Request ${newStatus.toLowerCase()} successfully`
        });
        fetchBorrowRequests();
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to update request status'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update request status'
      });
    }
  };

  const filteredRequests = filter === 'ALL' 
    ? borrowRequests 
    : borrowRequests.filter(request => request.status === filter);

  const getStatusColor = (status: BorrowRequestStatus) => {
    switch (status) {
      case BorrowRequestStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case BorrowRequestStatus.APPROVED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case BorrowRequestStatus.DENIED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
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
            Borrow Requests
          </h1>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as BorrowRequestStatus | 'ALL')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="ALL">All Requests</option>
              <option value={BorrowRequestStatus.PENDING}>Pending</option>
              <option value={BorrowRequestStatus.APPROVED}>Approved</option>
              <option value={BorrowRequestStatus.DENIED}>Denied</option>
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
                    Request Period
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
                {filteredRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.studentId.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.studentId.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.bookId.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          by {request.bookId.author}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>
                        <div>From: {new Date(request.requestedFromDate).toLocaleDateString()}</div>
                        <div>To: {new Date(request.requestedToDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {request.status === BorrowRequestStatus.PENDING && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(request._id, BorrowRequestStatus.APPROVED)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request._id, BorrowRequestStatus.DENIED)}
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
          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No borrow requests found
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
