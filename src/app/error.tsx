'use client';

import { useEffect } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (error) {
      console.error('Application error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <HiOutlineExclamationCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Something went wrong!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {error?.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Return to home
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && error?.stack && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200 font-mono whitespace-pre-wrap">
              {error.stack}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 