'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import authService from '../services/auth.service'
import { UserProfile } from '../types/auth'

/**
 * Authentication context interface
 */
interface AuthContextType {
  isLoading: boolean
  isAuthenticated: boolean
  user: UserProfile | null
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  error: null,
  login: async () => {},
  logout: () => {},
})

/**
 * Hook to use the auth context
 */
export const useAuthContext = () => useContext(AuthContext)

/**
 * Authentication provider component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  /**
   * Initializes authentication state from localStorage
   */
  const initialize = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const hasToken = authService.initializeAuth()

      if (hasToken) {
        // Fetch user profile if token exists
        const userProfile = await authService.getCurrentUser()
        setUser(userProfile)
        setIsAuthenticated(true)
      }
    } catch (err) {
      console.error('Auth initialization error:', err)
      // Clear auth state on error
      authService.logout()
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles user login
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await authService.login({ email, password })

      // Fetch user profile after successful login
      const userProfile = await authService.getCurrentUser()
      setUser(userProfile)
      setIsAuthenticated(true)
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
      setIsAuthenticated(false)
      setUser(null)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles user logout
   */
  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  // Initialize auth state on component mount
  useEffect(() => {
    initialize()
  }, [])

  // Provide the auth context to children
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
