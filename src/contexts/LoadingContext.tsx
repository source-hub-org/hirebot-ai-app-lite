'use client'

import React, { createContext, useContext, useState, ReactNode, useRef } from 'react'
import { MIN_LOADING_TIME } from '@/config/constants'

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
  const loadingStartTime = useRef<number>(0)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Shows the loading overlay
   */
  const showLoading = () => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }

    // Record the start time
    loadingStartTime.current = Date.now()
    setIsLoading(true)
  }

  /**
   * Hides the loading overlay after ensuring it's been visible for at least MIN_LOADING_TIME
   */
  const hideLoading = () => {
    const currentTime = Date.now()
    const elapsedTime = currentTime - loadingStartTime.current

    // If the loading has been shown for less than the minimum time,
    // delay hiding it until the minimum time has passed
    if (elapsedTime < MIN_LOADING_TIME) {
      const remainingTime = MIN_LOADING_TIME - elapsedTime

      // Clear any existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }

      // Set a timeout to hide the loading after the remaining time
      hideTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        hideTimeoutRef.current = null
      }, remainingTime)
    } else {
      // If it's been visible long enough, hide it immediately
      setIsLoading(false)
    }
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
