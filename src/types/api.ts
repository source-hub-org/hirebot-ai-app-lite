// src/types/api.ts

/**
 * Common response structure for API responses
 */
export interface ApiResponse<T> {
  status: string
  data: T
  message?: string
}

/**
 * Pagination information returned by API
 */
export interface Pagination {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: Pagination
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  status: string
  message: string
  error?: {
    code: string
    details: string[]
  }
}

/**
 * Validation error response structure
 */
export interface ValidationErrorResponse {
  status: string
  message: string
  errors: Array<{
    field: string
    message: string
  }>
}

/**
 * Position entity
 */
export interface Position {
  _id?: string
  slug: string
  title: string
  description: string
  instruction: string
  level: number
  is_active?: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * Language entity
 */
export interface Language {
  _id?: string
  name: string
  slug?: string
  designed_by: string
  first_appeared: number
  paradigm: string[]
  usage: string
  popularity_rank: number
  type_system: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Topic entity
 */
export interface Topic {
  _id?: string
  title: string
  difficulty: number
  popularity: 'low' | 'medium' | 'high'
  suitable_level: 'intern' | 'fresher' | 'junior' | 'middle' | 'senior' | 'lead'
  description: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Question entity
 */
export interface Question {
  _id?: string
  question: string
  options: string[]
  correct_answer: number[]
  explanation: string
  topic: string
  difficulty: number
  createdAt?: string
  updatedAt?: string
}

/**
 * Candidate entity
 */
export interface Candidate {
  _id?: string
  full_name: string
  email: string
  phone_number: string
  interview_level: 'intern' | 'fresher' | 'junior' | 'middle' | 'senior' | 'lead'
  gender?: string
  birthday?: string
  location?: string
  education_level?: string
  major?: string
  years_of_experience?: number
  current_position?: string
  skills?: string[]
  programming_languages?: string[]
  preferred_stack?: string
  assigned_topics?: string[]
  cv_url?: string
  portfolio_url?: string
  linkedin_url?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Submission entity
 */
export interface Submission {
  _id?: string
  candidate_id: string
  answers: Array<{
    question_id: string
    selected_options: number[]
    skipped: boolean
  }>
  score: number
  createdAt?: string
  updatedAt?: string
}

/**
 * Query parameters for positions
 */
export interface PositionQueryParams {
  title?: string
  slug?: string
  level?: number
  is_active?: boolean
  page?: number
  limit?: number
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
}

/**
 * Query parameters for questions search
 */
export interface QuestionSearchParams {
  topic?: string
  language?: string
  position?: string
  sort_by?: 'question' | 'category' | 'createdAt' | 'random'
  sort_direction?: 'asc' | 'desc'
  page?: number
  page_size?: number
  mode?: 'compact' | 'full' | 'minimalist'
  ignore_question_ids?: string
}

/**
 * Query parameters for languages
 */
export interface LanguageQueryParams {
  name?: string
  slug?: string
  designed_by?: string
  first_appeared?: number
  paradigm?: string
  popularity_rank?: number
  type_system?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
}

/**
 * Query parameters for candidates
 */
export interface CandidateQueryParams {
  name?: string
  email?: string
  status?: string
  interview_level?: 'intern' | 'fresher' | 'junior' | 'middle' | 'senior' | 'lead'
  skills?: string | string[]
  programming_languages?: string | string[]
  preferred_stack?: string
  years_of_experience?: number
  current_position?: string
  location?: string
  page?: number
  page_size?: number
  sort_by?: 'full_name' | 'email' | 'createdAt' | 'updatedAt' | 'interview_level'
  sort_direction?: 'asc' | 'desc'
}
