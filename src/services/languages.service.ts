// src/services/languages.service.ts
import api from '../../lib/axios.config'
import { ApiResponse, Language, LanguageQueryParams, PaginatedResponse } from '../types/api'
import { buildQueryString } from '../helpers/buildQueryString'
import { handleSuccessResponse, handleErrorResponse } from '../helpers/handleApiResponse'

/**
 * Fetches a list of languages with optional filtering and pagination
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to an array of languages and pagination info
 */
export async function getLanguages(params: LanguageQueryParams = {}): Promise<{
  languages: Language[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}> {
  try {
    const queryString = buildQueryString(params)
    const response = await api.get<PaginatedResponse<Language[]>>(
      `/api/proxy/languages${queryString}`
    )

    return {
      languages: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Fetches a single language by ID
 *
 * @param id - Language ID
 * @returns Promise resolving to a language
 */
export async function getLanguageById(id: string): Promise<Language> {
  try {
    const response = await api.get<ApiResponse<Language>>(`/api/proxy/languages/${id}`)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Creates a new language
 *
 * @param language - Language data
 * @returns Promise resolving to the created language
 */
export async function createLanguage(
  language: Omit<Language, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Language> {
  try {
    const response = await api.post<ApiResponse<Language>>('/api/proxy/languages', language)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Updates an existing language
 *
 * @param id - Language ID
 * @param language - Updated language data
 * @returns Promise resolving to the updated language
 */
export async function updateLanguage(
  id: string,
  language: Partial<Omit<Language, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<Language> {
  try {
    const response = await api.put<ApiResponse<Language>>(`/api/proxy/languages/${id}`, language)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Deletes a language
 *
 * @param id - Language ID
 * @returns Promise resolving to a success message
 */
export async function deleteLanguage(id: string): Promise<{ message: string }> {
  try {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/api/proxy/languages/${id}`
    )
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

const languageService = {
  getLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
}

export default languageService
