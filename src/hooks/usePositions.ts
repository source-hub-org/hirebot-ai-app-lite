import { useQuery } from '@tanstack/react-query'
import { getPositions } from '@/services/positionsService'
import { Position, PositionQueryParams, Pagination } from '@/types/api'

export function usePositions(params: PositionQueryParams = { limit: 100 }) {
  const { data, isLoading, error, refetch } = useQuery<{
    positions: Position[]
    pagination: Pagination
  }>({
    queryKey: ['positions', params],
    queryFn: () => getPositions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })

  return {
    positions: data?.positions || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  }
}
