// pages/api/proxy/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

// Remove trailing slash if present to avoid double slashes
const NEXT_PUBLIC_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
).replace(/\/$/, '')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract a path from a query and remove it from the query object
  const { path = [], ...queryParams } = req.query

  // Build the base target URL without query parameters
  const baseTargetUrl = `${NEXT_PUBLIC_API_BASE_URL}/${Array.isArray(path) ? path.join('/') : path}`

  // Create URL object to properly handle query parameters
  const targetUrl = new URL(baseTargetUrl)

  // Add all remaining query parameters to the URL
  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Handle array values (e.g., ?key=value1&key=value2)
      value.forEach(v => targetUrl.searchParams.append(key, v))
    } else if (value !== undefined) {
      // Handle single values
      targetUrl.searchParams.append(key, value as string)
    }
  })

  // For debugging
  console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL)

  // Log Request information
  console.log('Request to:', targetUrl.toString())
  console.log('Request method:', req.method)
  console.log('Request headers:', req.headers)
  console.log('Request body:', req.body)
  console.log('Query parameters:', queryParams)

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl.toString(),
      data: req.body || {},
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...req.headers, // Forward headers from a client if any
      },
    })

    // Log Response
    console.log('Response status:', response.status)
    console.log('Response data:', response.data)

    res.status(response.status).json(response.data)
  } catch (error) {
    // Type assertion for error
    const axiosError = error as AxiosError
    console.error('Error:', axiosError.response?.status, axiosError.message)

    res.status(axiosError.response?.status || 500).json({
      message: 'Proxy error',
      error: axiosError.message,
      data: axiosError.response?.data,
    })
  }
}
