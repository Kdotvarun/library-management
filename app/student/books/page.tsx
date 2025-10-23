'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useToast } from '@/components/Toast';
import { AvailabilityStatus } from '@/types';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImageURL?: string;
  availabilityStatus: AvailabilityStatus;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function BooksPage() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<AvailabilityStatus | 'ALL'>('ALL');

  const fetchBooks = useCallback(async () => {
    try {
      const response = await fetch('/api/books');
      if (response.ok) {
        const data = await response.json();
        setBooks(data.data || []);
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch books'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch books'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleBorrowRequest = async (bookId: string) => {
    try {
      const response = await fetch('/api/books/borrow-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
      });

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'Success',
          message: 'Borrow request submitted successfully'
        });
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to submit borrow request'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to submit borrow request'
      });
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || book.availabilityStatus === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case AvailabilityStatus.BORROWED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case AvailabilityStatus.RESERVED:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case AvailabilityStatus.MAINTENANCE:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Available Books
        </h1>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search books by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as AvailabilityStatus | 'ALL')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="ALL">All Books</option>
          <option value={AvailabilityStatus.AVAILABLE}>Available</option>
          <option value={AvailabilityStatus.BORROWED}>Borrowed</option>
          <option value={AvailabilityStatus.RESERVED}>Reserved</option>
          <option value={AvailabilityStatus.MAINTENANCE}>Maintenance</option>
        </select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div key={book._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {book.coverImageURL && (
              <Image
                src={book.coverImageURL}
                alt={book.title}
                className="w-full h-48 object-cover"
                width={400}
                height={192}
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {book.title}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(book.availabilityStatus)}`}>
                  {book.availabilityStatus}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                by {book.author}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                {book.genre}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {book.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Added {new Date(book.createdAt).toLocaleDateString()}
                </span>
                {book.availabilityStatus === AvailabilityStatus.AVAILABLE && (
                  <button
                    onClick={() => handleBorrowRequest(book._id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Request to Borrow
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No books found matching your criteria
        </div>
      )}
    </div>
  );
}
