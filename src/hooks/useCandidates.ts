// src/hooks/useCandidates.ts
import { useState, useEffect, useCallback } from 'react'
import { Candidate, CandidateQueryParams } from '../types/api'
import candidateService from '../services/candidates.service'

interface UseCandidatesResult {
  candidates: Candidate[]
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    page_size: number
    total_pages: number
  }
  fetchCandidates: (params?: CandidateQueryParams) => Promise<void>
  refetch: () => Promise<void>
}

/**
 * Hook for fetching and managing candidates data
 *
 * @param initialParams - Initial query parameters
 * @returns Object containing candidates data, loading state, error state, and fetch functions
 */
export function useCandidates(initialParams: CandidateQueryParams = {}): UseCandidatesResult {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState<CandidateQueryParams>(initialParams)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    page_size: 20,
    total_pages: 0,
  })

  const fetchCandidates = useCallback(
    async (newParams?: CandidateQueryParams) => {
      try {
        setLoading(true)
        setError(null)

        // Update params if new ones are provided
        const queryParams = newParams || params
        if (newParams) {
          setParams(newParams)
        }

        const result = await candidateService.getCandidates(queryParams)
        setCandidates(result.candidates)
        setPagination(result.pagination)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching candidates')
        console.error('Error in useCandidates hook:', err)
      } finally {
        setLoading(false)
      }
    },
    [params]
  )

  // Initial fetch
  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  // Refetch function that uses current params
  const refetch = useCallback(() => fetchCandidates(), [fetchCandidates])

  return {
    candidates,
    loading,
    error,
    pagination,
    fetchCandidates,
    refetch,
  }
}

export default useCandidates
