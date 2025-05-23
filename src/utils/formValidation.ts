/**
 * Form validation utilities
 */

/**
 * Validates email format
 */
export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'Email is required'
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Email is invalid'
  }
  return undefined
}

/**
 * Validates username
 */
export const validateUsername = (username: string): string | undefined => {
  if (!username) {
    return 'Username is required'
  }
  if (username.length < 3) {
    return 'Username must be at least 3 characters'
  }
  return undefined
}

/**
 * Validates password
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters'
  }
  return undefined
}

/**
 * Validates password confirmation
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmation: string
): string | undefined => {
  if (!confirmation) {
    return 'Please confirm your password'
  }
  if (password !== confirmation) {
    return 'Passwords do not match'
  }
  return undefined
}
