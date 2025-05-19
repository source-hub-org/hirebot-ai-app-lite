// src/utils/tokenStorage.ts
import Cookies from 'js-cookie'

// Cookie options
const cookieOptions = {
  expires: 7, // 7 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
}

/**
 * Stores an access token in cookies
 *
 * @param token - The access token to store
 */
export function setAccessToken(token: string): void {
  if (typeof window !== 'undefined') {
    // Store in cookies for both client and server-side access
    Cookies.set('accessToken', token, cookieOptions)
  }
}

/**
 * Retrieves the access token from cookies
 *
 * @returns The access token or null if not found
 */
export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return Cookies.get('accessToken') || null
  }
  return null
}

/**
 * Stores a refresh token in cookies
 *
 * @param token - The refresh token to store
 */
export function setRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    Cookies.set('refreshToken', token, cookieOptions)
  }
}

/**
 * Retrieves the refresh token from cookies
 *
 * @returns The refresh token or null if not found
 */
export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return Cookies.get('refreshToken') || null
  }
  return null
}

/**
 * Clears all authentication tokens from cookies
 */
export function clearTokens(): void {
  if (typeof window !== 'undefined') {
    // Clear cookies
    Cookies.remove('accessToken', { path: '/' })
    Cookies.remove('refreshToken', { path: '/' })
  }
}

/**
 * Checks if the user has a stored access token
 *
 * @returns Boolean indicating if an access token exists
 */
export function hasAccessToken(): boolean {
  return !!getAccessToken()
}

const tokenStorage = {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
  hasAccessToken,
}

export default tokenStorage
