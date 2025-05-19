'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CandidateProvider } from '@/contexts/CandidateContext'
import { LoadingProvider } from '@/contexts/LoadingContext'
import authService from '@/services/authService'
import { UserProfile } from '@/types/auth'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

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
 * Authentication provider component that also serves as the main app provider
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Use refs to avoid dependencies in useEffect
  const isAuthenticatedRef = React.useRef(isAuthenticated)

  /**
   * Initializes authentication state from localStorage
   */
  const initialize = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const hasToken = authService.initializeAuth()

      if (hasToken) {
        try {
          // Fetch user profile if token exists
          const userProfile = await authService.getCurrentUser()

          setUser(userProfile)
          setIsAuthenticated(true)
        } catch (profileError) {
          console.error('Failed to fetch user profile:', profileError)

          // If we can't get the user profile but have a token, create a default user
          // This ensures the user object is never null when authenticated
          setUser({
            id: 'temp-user',
            username: 'User',
            email: 'user@example.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          setIsAuthenticated(true)
        }
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

      try {
        // Fetch user profile after successful login
        const userProfile = await authService.getCurrentUser()
        setUser(userProfile)
        setIsAuthenticated(true)
      } catch (profileError) {
        console.error('Failed to fetch user profile after login:', profileError)

        // If we can't get the user profile but login succeeded, create a default user
        setUser({
          id: 'temp-user',
          username: email.split('@')[0], // Use part of email as username
          email: email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        setIsAuthenticated(true)
      }
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

  // Update ref when isAuthenticated changes
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated
  }, [isAuthenticated])

  // Set up token refresh interval only once
  useEffect(() => {
    // Set up an interval to refresh the token periodically (every 15 minutes)
    const refreshInterval = setInterval(
      () => {
        // Check the ref value, not the state directly
        if (isAuthenticatedRef.current) {
          authService.refreshToken().catch(error => {
            console.error('Token refresh failed:', error)
            // If refresh fails, log the user out
            authService.logout()
            setIsAuthenticated(false)
            setUser(null)
          })
        }
      },
      15 * 60 * 1000
    ) // 15 minutes

    return () => clearInterval(refreshInterval)
  }, [])

  // Combined provider that wraps all app providers
  return (
    <QueryClientProvider client={queryClient}>
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
        <LoadingProvider>
          <CandidateProvider>{children}</CandidateProvider>
        </LoadingProvider>
      </AuthContext.Provider>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
