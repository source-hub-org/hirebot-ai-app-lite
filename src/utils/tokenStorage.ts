// src/utils/tokenStorage.ts

/**
 * Stores an access token in localStorage
 *
 * @param token - The access token to store
 */
export function setAccessToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token)
  }
}

/**
 * Retrieves the access token from localStorage
 *
 * @returns The access token or null if not found
 */
export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

/**
 * Stores a refresh token in localStorage
 *
 * @param token - The refresh token to store
 */
export function setRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh_token', token)
  }
}

/**
 * Retrieves the refresh token from localStorage
 *
 * @returns The refresh token or null if not found
 */
export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token')
  }
  return null
}

/**
 * Clears all authentication tokens from localStorage
 */
export function clearTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
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
