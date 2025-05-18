// src/services/candidatesService.ts
import api from '../../lib/axios.config'
import { ApiResponse, PaginatedResponse, Candidate, CandidateQueryParams } from '@/types/api'
import { buildQueryString } from '@/helpers/buildQueryString'
import { handleSuccessResponse, handleErrorResponse } from '@/helpers/handleApiResponse'

/**
 * Fetches a list of candidates with optional filtering, pagination, and sorting
 *
 * @param params - Query parameters for filtering, pagination, and sorting
 * @returns Promise resolving to an array of candidates and pagination info
 */
export async function getCandidates(params: CandidateQueryParams = {}): Promise<{
  candidates: Candidate[]
  pagination: {
    total: number
    page: number
    page_size: number
    total_pages: number
  }
}> {
  try {
    const queryString = buildQueryString(params)

    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.get<PaginatedResponse<Candidate[]>>(
      `/api/proxy/candidates${queryString}`,
      config
    )

    return {
      candidates: response.data.data,
      pagination: {
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        page_size: response.data.pagination.pageSize,
        total_pages: response.data.pagination.totalPages,
      },
    }
  } catch (error) {
    console.error('Error fetching candidates:', error)
    // Return empty data instead of throwing
    return {
      candidates: [],
      pagination: {
        total: 0,
        page: 1,
        page_size: 20,
        total_pages: 0,
      },
    }
  }
}

/**
 * Fetches a single candidate by ID
 *
 * @param id - Candidate ID
 * @returns Promise resolving to a candidate
 */
export async function getCandidateById(id: string): Promise<Candidate> {
  try {
    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.get<ApiResponse<Candidate>>(`/api/proxy/candidates/${id}`, config)
    return handleSuccessResponse(response)
  } catch (_) {
    return handleErrorResponse(_)
  }
}

/**
 * Creates a new candidate
 *
 * @param candidate - Candidate data
 * @returns Promise resolving to the created candidate
 */
export async function createCandidate(
  candidate: Omit<Candidate, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Candidate> {
  try {
    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.post<ApiResponse<Candidate>>(
      '/api/proxy/candidates',
      candidate,
      config
    )
    return handleSuccessResponse(response)
  } catch (_) {
    return handleErrorResponse(_)
  }
}

/**
 * Updates an existing candidate
 *
 * @param id - Candidate ID
 * @param candidate - Updated candidate data
 * @returns Promise resolving to the updated candidate
 */
export async function updateCandidate(
  id: string,
  candidate: Partial<Omit<Candidate, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<Candidate> {
  try {
    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.put<ApiResponse<Candidate>>(
      `/api/proxy/candidates/${id}`,
      candidate,
      config
    )
    return handleSuccessResponse(response)
  } catch (_) {
    return handleErrorResponse(_)
  }
}

/**
 * Deletes a candidate
 *
 * @param id - Candidate ID
 * @returns Promise resolving to a success message
 */
export async function deleteCandidate(id: string): Promise<{ message: string }> {
  try {
    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/api/proxy/candidates/${id}`,
      config
    )
    return handleSuccessResponse(response)
  } catch (_) {
    return handleErrorResponse(_)
  }
}

const candidateService = {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
}

export default candidateService
