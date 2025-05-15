// src/components/candidate/CandidateSearch.tsx
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CandidateQueryParams } from '@/types/api'
interface CandidateSearchProps {
  onSearch: (params: CandidateQueryParams) => void
  isLoading?: boolean
}

export default function CandidateSearch({ onSearch, isLoading = false }: CandidateSearchProps) {
  const [searchParams, setSearchParams] = useState<CandidateQueryParams>({
    page: 1,
    page_size: 10,
    sort_by: 'full_name',
    sort_direction: 'asc',
  })

  // Update search params when input changes
  const handleInputChange = (
    field: keyof CandidateQueryParams,
    value: string | number | undefined
  ) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }))
  }

  // Handle search button click
  const handleSearch = () => {
    // Reset to page 1 when searching
    onSearch({ ...searchParams, page: 1 })
  }

  // Handle reset button click
  const handleReset = () => {
    setSearchParams({
      page: 1,
      page_size: 10,
      sort_by: 'full_name',
      sort_direction: 'asc',
    })
    onSearch({
      page: 1,
      page_size: 10,
      sort_by: 'full_name',
      sort_direction: 'asc',
    })
  }

  return (
    <div className="space-y-4 p-4 border rounded-md bg-background">
      <h3 className="text-lg font-medium">Search Candidates</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name search */}
        <div className="space-y-2">
          <label htmlFor="name" className="font-medium">
            Name
          </label>
          <Input
            id="name"
            placeholder="Search by name"
            value={searchParams.name || ''}
            onChange={e => handleInputChange('name', e.target.value)}
          />
        </div>

        {/* Email search */}
        <div className="space-y-2">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <Input
            id="email"
            placeholder="Search by email"
            value={searchParams.email || ''}
            onChange={e => handleInputChange('email', e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className="space-y-2">
          <label htmlFor="status" className="font-medium">
            Status
          </label>
          <Select
            value={searchParams.status || ''}
            onValueChange={value => handleInputChange('status', value || undefined)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="---">Any status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interview level filter */}
        <div className="space-y-2">
          <label htmlFor="interview_level" className="font-medium">
            Level
          </label>
          <Select
            value={searchParams.interview_level || ''}
            onValueChange={value => handleInputChange('interview_level', value || undefined)}
          >
            <SelectTrigger id="interview_level">
              <SelectValue placeholder="Any level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="---">Any level</SelectItem>
              <SelectItem value="intern">Intern</SelectItem>
              <SelectItem value="fresher">Fresher</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="middle">Middle</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort by */}
        <div className="space-y-2">
          <label htmlFor="sort_by" className="font-medium">
            Sort By
          </label>
          <Select
            value={searchParams.sort_by || 'full_name'}
            onValueChange={value => handleInputChange('sort_by', value)}
          >
            <SelectTrigger id="sort_by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="updatedAt">Date Updated</SelectItem>
              <SelectItem value="interview_level">Level</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort direction */}
        <div className="space-y-2">
          <label htmlFor="sort_direction" className="font-medium">
            Sort Direction
          </label>
          <Select
            value={searchParams.sort_direction || 'asc'}
            onValueChange={value => handleInputChange('sort_direction', value as 'asc' | 'desc')}
          >
            <SelectTrigger id="sort_direction">
              <SelectValue placeholder="Sort direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Reset
        </Button>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </div>
  )
}
