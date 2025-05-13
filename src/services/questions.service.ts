// src/services/questions.service.ts
import api from '../../lib/axios.config'
import { ApiResponse, PaginatedResponse, Question, QuestionSearchParams } from '../types/api'
import { buildQueryString } from '../helpers/buildQueryString'
import { handleSuccessResponse, handleErrorResponse } from '../helpers/handleApiResponse'

/**
 * Searches for questions based on various criteria
 *
 * @param params - Search parameters
 * @returns Promise resolving to an array of questions and pagination info
 */
export async function searchQuestions(params: QuestionSearchParams = {}): Promise<{
  questions: Question[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}> {
  try {
    const queryString = buildQueryString(params)
    const response = await api.get<PaginatedResponse<Question[]>>(
      `/api/questions/search${queryString}`
    )

    return {
      questions: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Fetches a single question by ID
 *
 * @param id - Question ID
 * @returns Promise resolving to a question
 */
export async function getQuestionById(id: string): Promise<Question> {
  try {
    const response = await api.get<ApiResponse<Question>>(`/api/questions/${id}`)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Creates a new question
 *
 * @param question - Question data
 * @returns Promise resolving to the created question
 */
export async function createQuestion(
  question: Omit<Question, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Question> {
  try {
    const response = await api.post<ApiResponse<Question>>('/api/questions', question)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Updates an existing question
 *
 * @param id - Question ID
 * @param question - Updated question data
 * @returns Promise resolving to the updated question
 */
export async function updateQuestion(
  id: string,
  question: Partial<Omit<Question, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<Question> {
  try {
    const response = await api.put<ApiResponse<Question>>(`/api/questions/${id}`, question)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Deletes a question
 *
 * @param id - Question ID
 * @returns Promise resolving to a success message
 */
export async function deleteQuestion(id: string): Promise<{ message: string }> {
  try {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/api/questions/${id}`)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

/**
 * Generates questions based on specified criteria
 *
 * @param params - Parameters for question generation
 * @returns Promise resolving to an array of generated questions
 */
export async function generateQuestions(params: {
  topic?: string
  language?: string
  position?: string
  count?: number
}): Promise<Question[]> {
  try {
    const response = await api.post<ApiResponse<Question[]>>('/api/questions/generate', params)
    return handleSuccessResponse(response)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

const questionService = {
  searchQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  generateQuestions,
}

export default questionService
