// pages/api/proxy/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { sanitizeInput } from '@/utils/sanitizeInput'

// Remove trailing slash if present to avoid double slashes
const API_BASE_URL = (process.env.API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '')

// Allowed HTTP methods
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

// Allowed paths for the proxy
const ALLOWED_PATHS = [
  'candidates',
  'questions',
  'topics',
  'languages',
  'positions',
  'submissions',
]

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
}

// Simple in-memory rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if method is allowed
  if (!req.method || !ALLOWED_METHODS.includes(req.method)) {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Get and validate path
  const { path = [] } = req.query
  const pathArray = Array.isArray(path) ? path : [path]

  // Check if the first path segment is allowed
  if (pathArray.length === 0 || !ALLOWED_PATHS.includes(pathArray[0])) {
    return res.status(403).json({ message: 'Forbidden path' })
  }

  // Construct target URL
  const targetUrl = `${API_BASE_URL}/${pathArray.join('/')}`

  // Implement rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  const clientId = clientIp as string

  const now = Date.now()
  const clientRequests = requestCounts.get(clientId) || { count: 0, resetTime: now + RATE_LIMIT.windowMs }

  // Reset count if window has passed
  if (now > clientRequests.resetTime) {
    clientRequests.count = 0
    clientRequests.resetTime = now + RATE_LIMIT.windowMs
  }

  // Increment request count
  clientRequests.count++
  requestCounts.set(clientId, clientRequests)

  // Check if rate limit exceeded
  if (clientRequests.count > RATE_LIMIT.maxRequests) {
    return res.status(429).json({ message: 'Too many requests, please try again later' })
  }

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT.maxRequests.toString())
  res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT.maxRequests - clientRequests.count).toString())
  res.setHeader('X-RateLimit-Reset', Math.ceil(clientRequests.resetTime / 1000).toString())

  // Sanitize request body to prevent XSS
  const sanitizedBody = req.body ? sanitizeInput(req.body) : {}

  // Set up request config
  const requestConfig: AxiosRequestConfig = {
    method: req.method,
    url: targetUrl,
    data: sanitizedBody,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
  }

  // Forward authorization header if present
  if (req.headers.authorization) {
    requestConfig.headers = {
      ...requestConfig.headers,
      Authorization: req.headers.authorization,
    }
  }

  // Forward CSRF token if present
  if (req.headers['x-csrf-token']) {
    requestConfig.headers = {
      ...requestConfig.headers,
      'X-CSRF-Token': req.headers['x-csrf-token'],
    }
  }

  try {
    const response = await axios(requestConfig)

    // Only log minimal info in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${req.method} ${targetUrl} - ${response.status}`)
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
    res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '))
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')

    // Return the response
    res.status(response.status).json(response.data)
  } catch (error) {
    // Type assertion for error
    const axiosError = error as AxiosError

    // Only log errors in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Proxy error:', axiosError.message)
    }

    // Return appropriate error response
    const statusCode = axiosError.response?.status || 500
    const errorMessage = statusCode === 500 
      ? 'Internal server error' 
      : axiosError.response?.data || axiosError.message

    res.status(statusCode).json({
      message: 'Proxy error',
      error: errorMessage,
    })
  }
}
