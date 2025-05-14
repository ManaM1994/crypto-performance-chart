"use client";

import React from "react";

interface ErrorFallbackProps {
  error: string;
  resetAction?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetAction,
}) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-6">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
      <p className="text-gray-700 text-center mb-4">{error}</p>

      {resetAction && (
        <button
          onClick={resetAction}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
