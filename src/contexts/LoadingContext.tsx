'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

/**
 * Loading context interface
 */
interface LoadingContextType {
  isLoading: boolean
  showLoading: () => void
  hideLoading: () => void
}

// Create the loading context with default values
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
})

/**
 * Hook to use the loading context
 */
export const useLoadingContext = () => useContext(LoadingContext)

/**
 * Loading provider component
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  /**
   * Shows the loading overlay
   */
  const showLoading = () => {
    setIsLoading(true)
  }

  /**
   * Hides the loading overlay
   */
  const hideLoading = () => {
    setIsLoading(false)
  }

  // Provide the loading context to children
  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        showLoading,
        hideLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}
