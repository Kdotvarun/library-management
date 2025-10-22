'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      const userRole = session.user.role as UserRole;
      if (userRole === UserRole.ADMIN) {
        router.push('/admin');
      } else if (userRole === UserRole.STUDENT) {
        router.push('/student');
      }
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Library Management System
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            A modern library management system built with Next.js 14, TypeScript, and MongoDB
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                📚 Books
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Manage your book collection with ease
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                👥 Users
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Handle user accounts and permissions
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                📋 Borrowing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Track book loans and returns
              </p>
            </div>
          </div>
          <div className="mt-8">
            <a
              href="/signin"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
