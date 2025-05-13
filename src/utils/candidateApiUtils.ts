// src/utils/candidateApiUtils.ts
import { Candidate, CandidateQueryParams } from '../types/api'
import candidateService from '../services/candidates.service'

/**
 * Fetches candidates with error handling and logging
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to an array of candidates and pagination info
 */
export async function fetchCandidatesWithErrorHandling(params: CandidateQueryParams = {}) {
  try {
    return await candidateService.getCandidates(params)
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
 * Fetches a single candidate by ID with error handling
 *
 * @param id - Candidate ID
 * @returns Promise resolving to a candidate or null if not found
 */
export async function fetchCandidateByIdWithErrorHandling(id: string): Promise<Candidate | null> {
  try {
    return await candidateService.getCandidateById(id)
  } catch (error) {
    console.error(`Error fetching candidate with ID ${id}:`, error)
    return null
  }
}

/**
 * Creates a new candidate with error handling
 *
 * @param candidate - Candidate data
 * @returns Promise resolving to the created candidate or error object
 */
export async function createCandidateWithErrorHandling(
  candidate: Omit<Candidate, '_id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; data?: Candidate; error?: string }> {
  try {
    const result = await candidateService.createCandidate(candidate)
    return { success: true, data: result }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Error creating candidate:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * Updates an existing candidate with error handling
 *
 * @param id - Candidate ID
 * @param candidate - Updated candidate data
 * @returns Promise resolving to the updated candidate or error object
 */
export async function updateCandidateWithErrorHandling(
  id: string,
  candidate: Partial<Omit<Candidate, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; data?: Candidate; error?: string }> {
  try {
    const result = await candidateService.updateCandidate(id, candidate)
    return { success: true, data: result }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error(`Error updating candidate with ID ${id}:`, errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * Deletes a candidate with error handling
 *
 * @param id - Candidate ID
 * @returns Promise resolving to success status and message
 */
export async function deleteCandidateWithErrorHandling(
  id: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const result = await candidateService.deleteCandidate(id)
    return { success: true, message: result.message }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error(`Error deleting candidate with ID ${id}:`, errorMessage)
    return { success: false, error: errorMessage }
  }
}

const candidateApiUtils = {
  fetchCandidatesWithErrorHandling,
  fetchCandidateByIdWithErrorHandling,
  createCandidateWithErrorHandling,
  updateCandidateWithErrorHandling,
  deleteCandidateWithErrorHandling,
}

export default candidateApiUtils
