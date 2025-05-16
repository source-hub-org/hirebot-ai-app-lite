// src/services/auth.service.ts
import api from '../../lib/axios.config'
import { AuthTokenResponse, LoginCredentials, UserProfile } from '../types/auth'
import { ApiResponse } from '../types/api'
import tokenStorage from '../utils/tokenStorage'
import { handleSuccessResponse, handleErrorResponse } from '../helpers/handleApiResponse'

/**
 * Retrieves environment variables for authentication
 */
const getAuthConfig = () => {
  return {
    clientId: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || 'test-client',
    clientSecret: process.env.NEXT_PUBLIC_AUTH_CLIENT_SECRET || 'test-secret',
  }
}

/**
 * Authenticates a user and retrieves access and refresh tokens
 *
 * @param credentials - User login credentials
 * @returns Promise resolving to authentication tokens
 */
export async function login(credentials: LoginCredentials): Promise<AuthTokenResponse> {
  const { clientId, clientSecret } = getAuthConfig()

  try {
    // Create a custom config for this specific request
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const formData = new URLSearchParams({
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      username: credentials.email,
      password: credentials.password,
    })

    // Use the absolute path to the Next.js API route
    const response = await api.post<AuthTokenResponse>('/api/proxy/oauth/token', formData, config)

    // Store tokens
    storeTokens(response.data)

    return response.data
  } catch (error) {
    console.error('Login error:', error)
    throw new Error('Authentication failed. Please check your credentials and try again.')
  }
}

/**
 * Refreshes the access token using the refresh token
 *
 * @returns Promise resolving to new authentication tokens
 */
export async function refreshToken(): Promise<AuthTokenResponse> {
  const { clientId, clientSecret } = getAuthConfig()
  const refreshToken = tokenStorage.getRefreshToken()

  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  try {
    // Create a custom config for this specific request
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const formData = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    })

    // Use the absolute path to the Next.js API route
    const response = await api.post<AuthTokenResponse>('/api/proxy/oauth/token', formData, config)

    // Store new tokens
    storeTokens(response.data)

    return response.data
  } catch (error) {
    console.error('Token refresh error:', error)
    // Clear tokens on refresh failure
    tokenStorage.clearTokens()
    throw new Error('Session expired. Please login again.')
  }
}

/**
 * Fetches the current user's profile
 *
 * @returns Promise resolving to user profile
 */
export async function getCurrentUser(): Promise<UserProfile> {
  try {
    // Get the user ID from the token or use 'me' as a special identifier
    const userId = 'me' // This could be extracted from the JWT token if needed

    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    // Use the absolute path to the Next.js API route
    const response = await api.get<ApiResponse<UserProfile>>(`/api/proxy/users/${userId}`, config)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Logs out the current user
 */
export function logout(): void {
  tokenStorage.clearTokens()
}

/**
 * Stores authentication tokens
 *
 * @param tokens - Authentication tokens
 */
function storeTokens(tokens: AuthTokenResponse): void {
  tokenStorage.setAccessToken(tokens.access_token)
  tokenStorage.setRefreshToken(tokens.refresh_token)
}

/**
 * Initializes authentication from stored tokens
 *
 * @returns Boolean indicating if valid tokens were found
 */
export function initializeAuth(): boolean {
  return tokenStorage.hasAccessToken()
}

const authService = {
  login,
  logout,
  refreshToken,
  getCurrentUser,
  initializeAuth,
}

export default authService
