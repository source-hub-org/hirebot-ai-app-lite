'use client'

import React from 'react'
import { useLoadingContext } from '@/contexts/LoadingContext'

/**
 * LoadingComponent displays a full-screen overlay with a centered loading animation
 * when the application is in a loading state.
 */
export default function LoadingComponent() {
  const { isLoading } = useLoadingContext()

  if (!isLoading) return null

  return (
    <div
      data-testid="loading-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      role="alert"
      aria-live="assertive"
      aria-busy="true"
    >
      <div
        data-testid="loading-container"
        className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center"
      >
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"
        ></div>
        <p className="text-gray-700">Loading...</p>
      </div>
    </div>
  )
}
