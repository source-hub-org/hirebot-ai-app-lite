import { useQuery } from '@tanstack/react-query'
import { getLanguages } from '@/services/languagesService'
import { Language, LanguageQueryParams, Pagination } from '@/types/api'

export function useLanguages(params: LanguageQueryParams = { limit: 100 }) {
  const { data, isLoading, error, refetch } = useQuery<{
    languages: Language[]
    pagination: Pagination
  }>({
    queryKey: ['languages', params],
    queryFn: () => getLanguages(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })

  return {
    languages: data?.languages || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  }
}
