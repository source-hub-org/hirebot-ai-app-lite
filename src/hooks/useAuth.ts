// src/hooks/useAuth.ts
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthProvider'
import { LoginCredentials } from '@/types/auth'

/**
 * Custom hook for authentication functionality with navigation
 */
export function useAuth() {
  const router = useRouter()
  const auth = useAuthContext()

  /**
   * Handles user login with redirect
   *
   * @param credentials - User login credentials
   * @param redirectPath - Path to redirect after successful login
   */
  const login = async (credentials: LoginCredentials, redirectPath = '/dashboard') => {
    try {
      await auth.login(credentials.email, credentials.password)
      // Use replace instead of push to avoid adding to history
      router.replace(redirectPath)
    } catch (error) {
      console.error('Login error:', error)
      throw error // Re-throw to allow form handling
    }
  }

  /**
   * Handles user logout with redirect
   *
   * @param redirectPath - Path to redirect after logout
   */
  const logout = (redirectPath = '/login') => {
    auth.logout()
    // Use replace instead of push to avoid adding to history
    router.replace(redirectPath)
  }

  return {
    ...auth,
    login,
    logout,
  }
}

export default useAuth
