// src/types/auth.ts

import { Candidate } from '@/types/api'

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
  username: string
  candidate_id?: string
  candidate?: Candidate
  createdAt?: string
  updatedAt?: string
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
