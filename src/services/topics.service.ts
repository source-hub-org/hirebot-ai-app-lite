// src/services/topics.service.ts
import api from '../../lib/axios.config'
import { ApiResponse, Topic } from '../types/api'
import { handleSuccessResponse, handleErrorResponse } from '../helpers/handleApiResponse'

/**
 * Fetches all available topics
 *
 * @returns Promise resolving to an array of topics
 */
export async function getTopics(): Promise<Topic[]> {
  try {
    const response = await api.get<ApiResponse<Topic[]>>('/api/proxy/topics')
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Fetches a single topic by ID
 *
 * @param id - Topic ID
 * @returns Promise resolving to a topic
 */
export async function getTopicById(id: string): Promise<Topic> {
  try {
    const response = await api.get<ApiResponse<Topic>>(`/api/proxy/topics/${id}`)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Creates a new topic
 *
 * @param topic - Topic data
 * @returns Promise resolving to the created topic
 */
export async function createTopic(
  topic: Omit<Topic, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Topic> {
  try {
    const response = await api.post<ApiResponse<Topic>>('/api/proxy/topics', topic)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Updates an existing topic
 *
 * @param id - Topic ID
 * @param topic - Updated topic data
 * @returns Promise resolving to the updated topic
 */
export async function updateTopic(
  id: string,
  topic: Partial<Omit<Topic, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<Topic> {
  try {
    const response = await api.put<ApiResponse<Topic>>(`/api/proxy/topics/${id}`, topic)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Deletes a topic
 *
 * @param id - Topic ID
 * @returns Promise resolving to a success message
 */
export async function deleteTopic(id: string): Promise<{ message: string }> {
  try {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/api/proxy/topics/${id}`)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

const topicService = {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
}

export default topicService
