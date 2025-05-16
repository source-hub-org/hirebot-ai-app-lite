// src/hooks/useAuth.ts
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../providers/AuthProvider'
import { LoginCredentials } from '../types/auth'

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
      router.push(redirectPath)
    } catch (err) {
      // Error is already handled in the context
    }
  }

  /**
   * Handles user logout with redirect
   *
   * @param redirectPath - Path to redirect after logout
   */
  const logout = (redirectPath = '/login') => {
    auth.logout()
    router.push(redirectPath)
  }

  return {
    ...auth,
    login,
    logout,
  }
}

export default useAuth
