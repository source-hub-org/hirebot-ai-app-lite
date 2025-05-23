// src/components/question/QuestionList.tsx
'use client'

import { useEffect, useState, memo, useCallback } from 'react'
import QuestionCard from '@/components/question/QuestionCard'
import { AnswerSubmission } from '@/types/api'
import { Button } from '@/components/ui/button'
import { useQuestions } from '@/hooks/useQuestions'
import { useLoading } from '@/hooks/useLoading'
import { useAuthContext } from '@/contexts/AuthProvider'

interface Submission {
  candidate_id: string
  answers: AnswerSubmission[]
}

function QuestionList() {
  // Get candidate_id from context
  const { user } = useAuthContext()

  // Use the question hook for state management
  const { questions, isLoading, error, submitAnswersAsync, isSubmitting, submissionResult } =
    useQuestions()

  // Use the loading hook for a global loading state
  const { withLoading } = useLoading()

  // State to store all submissions
  const [submission, setSubmission] = useState<Submission>({
    candidate_id: user?.candidate_id || '', // Will be set from context when submitting
    answers: [],
  })

  // Initialize empty answers when questions change - only on the initial load or when question array length changes
  useEffect(() => {
    if (questions && questions.length > 0) {
      // Create initial answers for all questions
      const initialAnswers = questions.map(q => ({
        question_id: q._id || '',
        answer: null,
        other: '',
        point: 0,
        is_skip: 0,
      }))

      // Set the initial answers without referencing the previous state
      setSubmission({
        candidate_id: user?.candidate_id || '',
        answers: initialAnswers,
      })
    }
  }, [questions?.length]) // Only run when the number of questions changes

  // Handle answer changes from individual question cards - memoized to prevent unnecessary re-renders
  const handleAnswerChange = useCallback((questionSubmission: AnswerSubmission) => {
    setSubmission(prev => {
      // Find if this question already has an answer
      const existingAnswerIndex = prev.answers.findIndex(
        a => a.question_id === questionSubmission.question_id
      )

      // Create a new answers array
      const newAnswers = [...prev.answers]

      if (existingAnswerIndex >= 0) {
        // Update the existing answer
        newAnswers[existingAnswerIndex] = questionSubmission
      } else {
        // Add a new answer
        newAnswers.push(questionSubmission)
      }

      return {
        ...prev,
        answers: newAnswers,
      }
    })
  }, []) // Empty dependency array since this function doesn't depend on any props or state

  // Handle submission of all answers
  const handleSubmit = useCallback(async () => {
    // Create a copy of the submission with the candidate_id from context
    const submissionData = {
      ...submission,
      candidate_id: user?.candidate_id || 'demo-candidate-id', // Fallback to demo ID if no candidate selected
    }

    // Validate if the candidate is selected
    if (!user?.candidate_id) {
      console.warn('No candidate selected. Using demo ID as fallback.')
    }

    console.log('Starting submission process with data:', submissionData)

    // Use withLoading to show a global loading state during submission
    await withLoading(async () => {
      try {
        // Call the mutation function and await its result
        const result = await submitAnswersAsync(submissionData)
        console.log('Submission completed with result:', result)

        // If we have an _id, redirect directly to the result page
        if (result && result._id) {
          const redirectUrl = `/submissions/${result._id}`
          console.log('Will redirect to:', redirectUrl)

          // Directly redirect using window.location.href instead of router.push
          setTimeout(() => {
            console.log('Executing redirect now to:', redirectUrl)
            window.location.href = redirectUrl
          }, 1500)
        } else {
          console.error('Missing _id in result:', result)
        }
      } catch (error) {
        console.error('Error submitting answers:', error)
      }
    })
  }, [user?.candidate_id, submission, submitAnswersAsync, withLoading])

  // Use an effect to handle the redirect after a successful submission
  // This is a fallback in case the direct redirect in handleSubmit doesn't work
  useEffect(() => {
    // Add console log to debug
    console.log('useEffect triggered with submission result:', submissionResult)

    if (submissionResult && submissionResult._id) {
      const redirectUrl = `/submissions/${submissionResult._id}`
      console.log('Fallback redirect will go to:', redirectUrl)

      // Short delay to allow the user to see the success message
      const timer = setTimeout(() => {
        console.log('Executing fallback redirect now to:', redirectUrl)
        // Use window.location.href for a hard redirect
        window.location.href = redirectUrl
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [submissionResult])

  // Loading state
  if (isLoading) {
    return (
      <section className="p-4">
        <div className="text-center text-gray-500">Loading questions...</div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="p-4">
        <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
          Error loading questions: {(error as Error).message}
        </div>
      </section>
    )
  }

  // Render the question list
  return (
    <section className="p-4 space-y-4">
      {questions.length > 0 ? (
        <>
          {/* Render all questions directly */}
          <div className="mb-6 space-y-4">
            {questions.map((question, idx) => (
              <div className="py-2" key={question._id || idx}>
                <QuestionCard question={question} onAnswerChange={handleAnswerChange} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || questions.length === 0}
              className="w-full max-w-md"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answers'}
            </Button>

            {submissionResult && (
              <div
                className={`mt-4 p-4 rounded-md w-full max-w-md text-center ${
                  submissionResult.score
                    ? 'bg-green-50 text-green-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {submissionResult.message && <p>{submissionResult.message}</p>}
                {submissionResult.score !== undefined && (
                  <p className="font-bold mt-2">Your score: {submissionResult.score}%</p>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          No questions available. Use the + button to add questions.
        </div>
      )}
    </section>
  )
}

// Export the memoized component to prevent unnecessary re-renders
export default memo(QuestionList)
