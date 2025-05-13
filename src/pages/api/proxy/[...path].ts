// pages/api/proxy/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

// Remove trailing slash if present to avoid double slashes
const API_BASE_URL = (process.env.API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path = [] } = req.query
  const targetUrl = `${API_BASE_URL}/${Array.isArray(path) ? path.join('/') : path}`

  // For debugging
  console.log('API_BASE_URL:', process.env.API_BASE_URL)

  // Log thông tin Request
  console.log('Request to:', targetUrl)
  console.log('Request method:', req.method)
  console.log('Request headers:', req.headers)
  console.log('Request body:', req.body)

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body || {},
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...req.headers, // Gửi các header từ client nếu có
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
