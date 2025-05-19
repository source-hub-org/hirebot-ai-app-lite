// src/components/candidate/CandidateList.tsx
import { useState, memo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { CandidateQueryParams } from '@/types/api'
import { useCandidates } from '@/hooks/useCandidates'
import { useLoading } from '@/hooks/useLoading'

// Dynamically import CandidateSearch component for code splitting
const CandidateSearch = dynamic(() => import('./CandidateSearch'), {
  loading: () => <div className="h-12 w-full bg-gray-100 animate-pulse rounded-md"></div>,
})

function CandidateList() {
  const [searchParams, setSearchParams] = useState<CandidateQueryParams>({
    page: 1,
    page_size: 10,
    sort_by: 'full_name',
    sort_direction: 'asc',
  })

  const { candidates, loading, error, pagination, fetchCandidates } = useCandidates(searchParams)
  const { withLoading } = useLoading()

  // Handle search with useCallback to prevent unnecessary re-renders
  const handleSearch = useCallback(
    async (params: CandidateQueryParams) => {
      setSearchParams(params)
      await withLoading(async () => {
        await fetchCandidates(params)
      })
    },
    [fetchCandidates, withLoading]
  )

  // Handle pagination with useCallback
  const handlePageChange = useCallback(
    async (newPage: number) => {
      const updatedParams = { ...searchParams, page: newPage }
      setSearchParams(updatedParams)
      await withLoading(async () => {
        await fetchCandidates(updatedParams)
      })
    },
    [searchParams, fetchCandidates, withLoading]
  )

  // Format date for display - memoize this function
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }, [])

  return (
    <div className="space-y-6">
      <CandidateSearch onSearch={handleSearch} isLoading={loading} />

      {error && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">{error}</div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading candidates...
                </TableCell>
              </TableRow>
            ) : candidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No candidates found
                </TableCell>
              </TableRow>
            ) : (
              candidates.map(candidate => (
                <TableRow key={candidate._id}>
                  <TableCell className="font-medium">{candidate.full_name}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{candidate.interview_level}</TableCell>
                  <TableCell>{candidate.status || 'N/A'}</TableCell>
                  <TableCell>{formatDate(candidate.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && candidates.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">
            Showing {candidates.length} of {pagination.total} candidates
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.total_pages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Export the memoized component to prevent unnecessary re-renders
export default memo(CandidateList)
