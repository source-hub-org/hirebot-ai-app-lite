/**
 * Utility function to sanitize user input to prevent XSS attacks
 *
 * @param input - The input to sanitize (can be a string, object, or array)
 * @returns The sanitized input
 */
export function sanitizeInput<T>(input: T): T {
  // If input is null or undefined, return it as is
  if (input === null || input === undefined) {
    return input
  }

  // If input is a string, sanitize it
  if (typeof input === 'string') {
    return sanitizeString(input)
  }

  // If input is an array, sanitize each element
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item))
  }

  // If input is an object, sanitize each property
  if (typeof input === 'object') {
    const sanitizedObject: Record<string, unknown> = {}
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitizedObject[key] = sanitizeInput(input[key])
      }
    }
    return sanitizedObject
  }

  // For other types (number, boolean, etc.), return as is
  return input
}

/**
 * Sanitize a string to prevent XSS attacks
 *
 * @param str - The string to sanitize
 * @returns The sanitized string
 */
function sanitizeString(str: string): string {
  // Replace potentially dangerous characters with their HTML entities
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#96;')
}
