// src/libs/axiosConfig.ts
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ErrorResponse, ValidationErrorResponse } from '@/types/api'
import tokenStorage from '@/utils/tokenStorage'

// Extend AxiosRequestConfig to include _retry property
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
  }
}

// Create a map to store request cancellation tokens
const pendingRequests = new Map<string, AbortController>()

// Generate a unique key for each request
const getRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
}

// Create axios instance with the default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Cancel any pending requests with the same key
    const requestKey = getRequestKey(config)
    if (pendingRequests.has(requestKey)) {
      pendingRequests.get(requestKey)?.abort()
      pendingRequests.delete(requestKey)
    }

    // Create a new abort controller for this request
    const controller = new AbortController()
    config.signal = controller.signal
    pendingRequests.set(requestKey, controller)

    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken
    }

    // Add authorization header if token exists
    const token = tokenStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Track if we're currently refreshing the token
let isRefreshing = false
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = []

// Process the failed queue
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })

  failedQueue = []
}

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Remove the request from pending requests
    const requestKey = getRequestKey(response.config)
    pendingRequests.delete(requestKey)

    return response
  },
  async (error: AxiosError<ErrorResponse | ValidationErrorResponse> | Error | unknown) => {
    // Remove the request from pending requests
    if (axios.isAxiosError(error) && error.config) {
      const requestKey = getRequestKey(error.config)
      pendingRequests.delete(requestKey)
    }

    // Only log errors in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', error)
    }

    // Handle authentication errors
    if (axios.isAxiosError(error) && error.response?.status === 401 && error.config) {
      const originalRequest = error.config

      // Prevent infinite loops - don't retry already retried requests
      if (originalRequest._retry) {
        // Clear tokens and redirect to login
        tokenStorage.clearTokens()

        // Use setTimeout to avoid immediate redirect during request handling
        setTimeout(() => {
          window.location.href = '/login'
        }, 100)

        return Promise.reject(new Error('Authentication failed. Please log in again.'))
      }

      // Check if we have a refresh token
      const refreshToken = tokenStorage.getRefreshToken()
      if (!refreshToken) {
        // No refresh token, redirect to login
        setTimeout(() => {
          window.location.href = '/login'
        }, 100)

        return Promise.reject(new Error('Authentication required. Please log in.'))
      }

      // Mark this request as retried
      originalRequest._retry = true

      // If we're already refreshing, add this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return axios(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      isRefreshing = true

      try {
        // Import authService dynamically to avoid circular dependencies
        const authServiceModule = await import('@/services/authService')
        const authService = authServiceModule.default

        // Try to refresh the token
        const tokenResponse = await authService.refreshToken()
        const newToken = tokenResponse.access_token

        // Update the Authorization header with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        // Process the queue with the new token
        processQueue(null, newToken)

        // Reset refreshing state
        isRefreshing = false

        // Retry the original request
        return axios(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)

        // Process the queue with the error
        processQueue(new Error('Token refresh failed'))

        // Clear tokens and redirect to login
        tokenStorage.clearTokens()

        // Use setTimeout to avoid immediate redirect during request handling
        setTimeout(() => {
          window.location.href = '/login'
        }, 100)

        // Reset refreshing state
        isRefreshing = false

        return Promise.reject(new Error('Authentication failed. Please log in again.'))
      }
    }

    // Handle forbidden errors
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action.'))
    }

    // Handle didn't found errors
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return Promise.reject(new Error('The requested resource was not found.'))
    }

    // Handle validation errors
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 422 &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      'errors' in error.response.data
    ) {
      const validationErrors = (error.response.data as ValidationErrorResponse).errors
        .map(err => `${err.field}: ${err.message}`)
        .join(', ')
      return Promise.reject(new Error(`Validation error: ${validationErrors}`))
    }

    // Handle server errors
    if (axios.isAxiosError(error) && error.response?.status && error.response.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'))
    }

    // Handle network errors
    if (axios.isAxiosError(error) && error.message === 'Network Error') {
      return Promise.reject(new Error('Network error. Please check your internet connection.'))
    }

    // Handle timeout errors
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'))
    }

    // Handle cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(new Error('Request cancelled'))
    }

    // Handle other errors
    if (
      axios.isAxiosError(error) &&
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'message' in error.response.data
    ) {
      return Promise.reject(new Error(error.response.data.message as string))
    }

    return Promise.reject(error)
  }
)

// Function to cancel all pending requests (useful when unmounting components)
export const cancelAllRequests = () => {
  pendingRequests.forEach(controller => {
    controller.abort()
  })
  pendingRequests.clear()
}

export default api
