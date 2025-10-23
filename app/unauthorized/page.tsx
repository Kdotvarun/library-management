import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white">403</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            You don&apos;t have permission to access this page.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Go Home
          </Link>
          
          <div>
            <Link
              href="/signin"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign in with different account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
