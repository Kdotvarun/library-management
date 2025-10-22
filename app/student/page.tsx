'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function StudentDashboard() {
  const { data: session } = useSession();

  const myStats = [
    { name: 'Books Borrowed', value: '5', change: '+2 this month', changeType: 'positive' },
    { name: 'Active Reservations', value: '2', change: 'Table 3, Seat 2', changeType: 'neutral' },
    { name: 'Pending Requests', value: '1', change: 'Awaiting approval', changeType: 'neutral' },
    { name: 'Books Returned', value: '12', change: '+3 this month', changeType: 'positive' },
  ];

  const quickActions = [
    {
      name: 'Browse Books',
      description: 'Search and explore available books',
      href: '/student/books',
      icon: '🔍',
    },
    {
      name: 'Make Reservation',
      description: 'Reserve a table and seat in the library',
      href: '/student/reservations/new',
      icon: '📅',
    },
    {
      name: 'My Reservations',
      description: 'View and manage your reservations',
      href: '/student/reservations',
      icon: '📋',
    },
    {
      name: 'Borrow Request',
      description: 'Request to borrow a book',
      href: '/student/borrow-request',
      icon: '📖',
    },
  ];

  const recentBooks = [
    {
      title: 'Introduction to React',
      author: 'John Doe',
      dueDate: '2024-01-15',
      status: 'borrowed',
    },
    {
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      dueDate: '2024-01-20',
      status: 'borrowed',
    },
    {
      title: 'Clean Code',
      author: 'Robert Martin',
      dueDate: '2024-01-10',
      status: 'returned',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Student Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {session?.user?.name}. Manage your library activities.
        </p>
      </div>

      {/* My Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          My Library Activity
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {myStats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' 
                            ? 'text-green-600 dark:text-green-400' 
                            : stat.changeType === 'negative'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Books */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Books
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            {recentBooks.map((book, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {book.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      by {book.author}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.status === 'borrowed' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {book.status}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Due: {book.dueDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
