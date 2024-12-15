'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg 
              hover:bg-primary-600 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg 
              hover:bg-gray-300 transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
} 