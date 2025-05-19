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
    <div className="fixed inset-0 z-[999] bg-white opacity-75">
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  )
}
