import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { searchQuestions, submitAnswers } from '@/services/questionsService'
import { AnswerSubmission, Question, QuestionSearchParams } from '@/types/api'

interface SubmissionData {
  candidate_id: string
  answers: AnswerSubmission[]
}

export function useQuestions() {
  const queryClient = useQueryClient()

  // Query for fetching questions
  const {
    data: questions = [] as Question[],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      // This will be empty initially and populated by the searchQuestions mutation
      return [] as Question[]
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
    mutateAsync: submitAnswersAsync,
    isPending: isSubmitting,
    error: submitError,
    data: submissionResult,
  } = useMutation({
    mutationFn: (data: SubmissionData) => submitAnswers(data),
    // Adding onSuccess to ensure the mutation result is properly handled
    onSuccess: data => {
      console.log('Mutation onSuccess called with data:', data)
      // Explicitly update the cache with the submission result
      queryClient.setQueryData(['submissionResult'], data)
      console.log('Updated query cache with submission result')
    },
    onError: error => {
      console.error('Submission error:', error)
    },
  })

  return {
    questions,
    isLoading,
    error,
    searchQuestions: searchQuestionsMutation,
    isSearching,
    searchError,
    submitAnswers: submitAnswersMutation,
    submitAnswersAsync,
    isSubmitting,
    submitError,
    submissionResult,
    refetchQuestions: refetch,
  }
}
