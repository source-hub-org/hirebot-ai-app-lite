import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { searchQuestions, submitAnswers } from '@/services/questionsService'
import { AnswerSubmission } from '@/types/api'

interface QuestionSearchParams {
  topic?: string
  language?: string
  position?: string
  page_size?: number
}

interface SubmissionData {
  candidate_id: string
  answers: AnswerSubmission[]
}

export function useQuestions() {
  const queryClient = useQueryClient()

  // Query for fetching questions
  const {
    data: questions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      // This will be empty initially and populated by the searchQuestions mutation
      return []
    },
    enabled: false, // Don't run this query automatically
  })

  // Mutation for searching questions
  const {
    mutate: searchQuestionsMutation,
    isPending: isSearching,
    error: searchError,
  } = useMutation({
    mutationFn: async (params: QuestionSearchParams) => {
      const result = await searchQuestions(params)
      return result.questions
    },
    onSuccess: data => {
      // Update the questions in the cache
      queryClient.setQueryData(['questions'], data)
    },
  })

  // Mutation for submitting answers
  const {
    mutate: submitAnswersMutation,
    isPending: isSubmitting,
    error: submitError,
    data: submissionResult,
  } = useMutation({
    mutationFn: (data: SubmissionData) => submitAnswers(data),
  })

  return {
    questions,
    isLoading,
    error,
    searchQuestions: searchQuestionsMutation,
    isSearching,
    searchError,
    submitAnswers: submitAnswersMutation,
    isSubmitting,
    submitError,
    submissionResult,
    refetchQuestions: refetch,
  }
}
