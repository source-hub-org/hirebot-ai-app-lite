// src/helpers/handleApiResponse.ts
import { AxiosError, AxiosResponse } from 'axios'
import { ApiResponse, ErrorResponse, ValidationErrorResponse } from '@/types/api'

/**
 * Handles successful API responses
 *
 * @param response - Axios response object
 * @returns The data from the response
 */
export function handleSuccessResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  return response.data.data
}

/**
 * Handles API error responses
 *
 * @param error - Axios error object
 * @throws Error with appropriate message
 */
export function handleErrorResponse(
  error: AxiosError<ErrorResponse | ValidationErrorResponse>
): never {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorData = error.response.data

    if ('errors' in errorData) {
      // Validation error
      const validationErrors = (errorData as ValidationErrorResponse).errors
        .map(err => `${err.field}: ${err.message}`)
        .join(', ')

      throw new Error(`Validation error: ${validationErrors}`)
    } else if (errorData.error?.details) {
      // Error with details
      throw new Error(`API error: ${errorData.message} - ${errorData.error.details.join(', ')}`)
    } else {
      // General error
      throw new Error(`API error: ${errorData.message || 'Unknown error'}`)
    }
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response received from server. Please check your network connection.')
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error(`Request error: ${error.message}`)
  }
}

const apiResponseHandlers = {
  handleSuccessResponse,
  handleErrorResponse,
}

export default apiResponseHandlers
