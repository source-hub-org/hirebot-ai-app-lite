import { useQuery } from '@tanstack/react-query'
import { getTopics } from '@/services/topicsService'
import { Topic } from '@/types/api'

export function useTopics() {
  const {
    data: topics = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Topic[]>({
    queryKey: ['topics'],
    queryFn: getTopics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })

  return {
    topics,
    isLoading,
    error,
    refetch,
  }
}
