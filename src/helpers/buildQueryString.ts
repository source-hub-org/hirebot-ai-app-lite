// src/helpers/buildQueryString.ts

/**
 * Builds a query string from an object of parameters
 *
 * @param params - Object containing query parameters
 * @returns Formatted query string starting with '?' or empty string if no params
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | string[] | number[]>
): string {
  // Filter out undefined, null, and empty string values
  const filteredParams = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ''
  )

  if (filteredParams.length === 0) {
    return ''
  }

  // Build the query string
  const queryString = filteredParams
    .map(([key, value]) => {
      // Handle arrays by joining with commas
      if (Array.isArray(value)) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value.join(','))}`
      }

      // Handle boolean values
      if (typeof value === 'boolean') {
        return `${encodeURIComponent(key)}=${value}`
      }

      // Handle other values
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    })
    .join('&')

  return `?${queryString}`
}

export default buildQueryString
