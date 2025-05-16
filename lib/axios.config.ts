// lib/axios.config.ts
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ErrorResponse, ValidationErrorResponse } from '@/types/api'

// Create a map to store request cancellation tokens
const pendingRequests = new Map<string, AbortController>()

// Generate a unique key for each request
const getRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
}

// Create axios instance with default config
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
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Remove the request from pending requests
    const requestKey = getRequestKey(response.config)
    pendingRequests.delete(requestKey)

    return response
  },
  (error: AxiosError<ErrorResponse | ValidationErrorResponse>) => {
    // Remove the request from pending requests
    if (error.config) {
      const requestKey = getRequestKey(error.config)
      pendingRequests.delete(requestKey)
    }

    // Only log errors in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', error)
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Redirect to login page or refresh token
      window.location.href = '/login'
      return Promise.reject(new Error('Authentication required. Please log in.'))
    }

    // Handle forbidden errors
    if (error.response?.status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action.'))
    }

    // Handle not found errors
    if (error.response?.status === 404) {
      return Promise.reject(new Error('The requested resource was not found.'))
    }

    // Handle validation errors
    if (error.response?.status === 422 && 'errors' in (error.response.data || {})) {
      const validationErrors = (error.response.data as ValidationErrorResponse).errors
        .map(err => `${err.field}: ${err.message}`)
        .join(', ')
      return Promise.reject(new Error(`Validation error: ${validationErrors}`))
    }

    // Handle server errors
    if (error.response?.status && error.response.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'))
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Network error. Please check your internet connection.'))
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'))
    }

    // Handle cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(new Error('Request cancelled'))
    }

    // Handle other errors
    return Promise.reject(
      error.response?.data?.message ? new Error(error.response.data.message) : error
    )
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
