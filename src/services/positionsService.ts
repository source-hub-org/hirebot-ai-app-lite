// src/services/positionsService.ts
import api from '../libs/axiosConfig'
import { ApiResponse, PaginatedResponse, Position, PositionQueryParams } from '@/types/api'
import { buildQueryString } from '@/helpers/buildQueryString'
import { handleSuccessResponse, handleErrorResponse } from '@/helpers/handleApiResponse'

/**
 * Fetches a list of positions with optional filtering and pagination
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to an array of positions and pagination info
 */
export async function getPositions(params: PositionQueryParams = {}): Promise<{
  positions: Position[]
  pagination: {
    total: number
    page: number
    limit: number
  }
}> {
  try {
    const queryString = buildQueryString(params)

    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.get<PaginatedResponse<Position[]>>(
      `/api/proxy/positions${queryString}`,
      config
    )

    return {
      positions: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Fetches a single position by ID
 *
 * @param id - Position ID
 * @returns Promise resolving to a position
 */
export async function getPositionById(id: string): Promise<Position> {
  try {
    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.get<ApiResponse<Position>>(`/api/proxy/positions/${id}`, config)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Creates a new position
 *
 * @param position - Position data
 * @returns Promise resolving to the created position
 */
export async function createPosition(
  position: Omit<Position, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Position> {
  try {
    // Create a custom config for this specific request
    const config = {
      // Override the baseURL to use the Next.js API route
      baseURL: '',
    }

    const response = await api.post<ApiResponse<Position>>('/api/proxy/positions', position, config)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Updates an existing position
 *
 * @param id - Position ID
 * @param position - Updated position data
 * @returns Promise resolving to the updated position
 */
export async function updatePosition(
  id: string,
  position: Partial<Omit<Position, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<Position> {
  try {
    const response = await api.put<ApiResponse<Position>>(`/api/proxy/positions/${id}`, position)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Deletes a position
 *
 * @param id - Position ID
 * @returns Promise resolving to a success message
 */
export async function deletePosition(id: string): Promise<{ message: string }> {
  try {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/api/proxy/positions/${id}`
    )
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

const positionService = {
  getPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
}

export default positionService
