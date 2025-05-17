// src/config/constants.ts

/**
 * Application-wide constants
 */

/**
 * Minimum time in milliseconds that the loading overlay should be visible
 * Default to 500ms if not specified in environment variables
 */
export const MIN_LOADING_TIME = parseInt(process.env.NEXT_PUBLIC_MIN_LOADING_TIME || '500', 10)

// Export other constants as needed
