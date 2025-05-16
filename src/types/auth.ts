// src/types/auth.ts

/**
 * Authentication credentials for login
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Authentication token response from OAuth server
 */
export interface AuthTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

/**
 * User profile information
 */
export interface UserProfile {
  id: string
  email: string
  name: string
  role: string
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
  accessToken: string | null
  refreshToken: string | null
}
