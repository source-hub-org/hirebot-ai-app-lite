// src/components/candidate/CandidateDropdown.tsx
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Candidate } from '@/types/api'
import candidateService from '@/services/candidates.service'
import { useCandidateContext } from '@/contexts/CandidateContext'

interface CandidateDropdownProps {
  disabled: boolean
  onSelect?: (candidateId: string) => void
  value?: string
}

export default function CandidateDropdown({ disabled, onSelect, value }: CandidateDropdownProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setCandidateId } = useCandidateContext()

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true)
        // Get candidates with pagination, sorting by name in ascending order
        const result = await candidateService.getCandidates({
          sort_by: 'full_name',
          sort_direction: 'asc',
          page: 1,
          page_size: 50, // Limit to 50 candidates for dropdown
        })
        setCandidates(result.candidates)
      } catch (err) {
        console.error('Error fetching candidates:', err)
        setError('Failed to load candidates')
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [])

  const handleValueChange = (candidateId: string) => {
    // Save to context
    setCandidateId(candidateId)
    
    // Also call the onSelect prop if provided
    if (onSelect) {
      onSelect(candidateId)
    }
  }

  return (
    <div className="min-w-[15rem]">
      <Select disabled={disabled || loading} value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={loading ? 'Loading...' : 'Chọn ứng viên'} />
        </SelectTrigger>
        <SelectContent>
          {error ? (
            <SelectItem value="error" disabled>
              Error loading candidates
            </SelectItem>
          ) : loading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : candidates.length === 0 ? (
            <SelectItem value="empty" disabled>
              No candidates found
            </SelectItem>
          ) : (
            candidates.map(candidate => (
              <SelectItem key={candidate._id} value={candidate._id || ''}>
                {candidate.full_name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
