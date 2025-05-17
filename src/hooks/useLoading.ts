// src/hooks/useLoading.ts
import { useLoadingContext } from '@/contexts/LoadingContext'

/**
 * Custom hook for managing application-wide loading state
 *
 * @returns Object with loading state and control functions
 */
export function useLoading() {
  const loadingContext = useLoadingContext()

  /**
   * Executes an async function while showing the loading overlay
   *
   * @param asyncFn - Async function to execute
   * @returns Result of the async function
   */
  const withLoading = async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      loadingContext.showLoading()
      return await asyncFn()
    } finally {
      loadingContext.hideLoading()
    }
  }

  return {
    ...loadingContext,
    withLoading,
  }
}

export default useLoading
