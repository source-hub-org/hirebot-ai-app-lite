// src/services/languagesService.ts
import api from '../libs/axiosConfig'
import { ApiResponse, Language, LanguageQueryParams, PaginatedResponse } from '@/types/api'
import { buildQueryString } from '@/helpers/buildQueryString'
import { handleSuccessResponse, handleErrorResponse } from '@/helpers/handleApiResponse'

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

    const response = await api.get<PaginatedResponse<Language[]>>(
      `/api/proxy/languages${queryString}`,
      config
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
    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.get<ApiResponse<Language>>(`/api/proxy/languages/${id}`, config)
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
    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.post<ApiResponse<Language>>('/api/proxy/languages', language, config)
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
    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.put<ApiResponse<Language>>(
      `/api/proxy/languages/${id}`,
      language,
      config
    )
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
    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/api/proxy/languages/${id}`,
      config
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
