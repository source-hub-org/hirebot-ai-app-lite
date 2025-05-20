// src/helpers/handleApiResponse.ts
import { AxiosResponse } from 'axios'
import { ApiResponse } from '@/types/api'

/**
 * Handles successful API responses
 *
 * @param response - Axios response object
 * @returns The data from the response
 * @throws Error when response status is 'error'
 */
export function handleSuccessResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  console.log('Processing API response in handleSuccessResponse:', response.data)

  const { status, message, data } = response.data

  if (status === 'error') {
    throw new Error(`API error: ${message || 'Unknown error'}`)
  }

  console.log('Extracted data from API response:', data)
  return data
}

/**
 * Handles API error responses
 *
 * @param error - Any error object
 * @throws Error with the appropriate message
 */
export function handleErrorResponse(error: unknown): never {
  console.log(error)
  throw new Error('No response received from server. Please check your network connection.')
}

const apiResponseHandlers = {
  handleSuccessResponse,
  handleErrorResponse,
}

export default apiResponseHandlers
