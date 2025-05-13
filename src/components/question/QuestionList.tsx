// src/components/question/QuestionList.tsx
'use client'

import { useEffect, useState } from 'react'
import QuestionCard from '@/components/question/QuestionCard'
import { Question } from '@/types/api'
import { Button } from '@/components/ui/button'
import { submitAnswers } from '@/services/questions.service'

// Define the submission interface
interface AnswerSubmission {
  question_id: string
  answer: number | null
  other: string
  point: number
  is_skip: number
}

interface Submission {
  candidate_id: string
  answers: AnswerSubmission[]
}

export default function QuestionList() {
  // State to store questions from API
  const [questions, setQuestions] = useState<Question[]>([])
  // State to store all submissions
  const [submission, setSubmission] = useState<Submission>({
    candidate_id: '', // This would typically come from the user session or context
    answers: [],
  })

  // Listen for the custom event from AddQuestionPopover
  useEffect(() => {
    const handleQuestionsLoaded = (event: CustomEvent) => {
      const { questions } = event.detail
      setQuestions(questions)

      // Initialize empty answers for each question
      if (questions && questions.length > 0) {
        const initialAnswers = questions.map(q => ({
          question_id: q._id || '',
          answer: null,
          other: '',
          point: 0,
          is_skip: 0,
        }))

        setSubmission(prev => ({
          ...prev,
          answers: initialAnswers,
        }))
      }
    }

    // Add event listener
    window.addEventListener('questionsLoaded', handleQuestionsLoaded as EventListener)

    // Clean up
    return () => {
      window.removeEventListener('questionsLoaded', handleQuestionsLoaded as EventListener)
    }
  }, [])

  // Handle answer changes from individual question cards
  const handleAnswerChange = (questionSubmission: AnswerSubmission) => {
    setSubmission(prev => {
      // Find if this question already has an answer
      const existingAnswerIndex = prev.answers.findIndex(
        a => a.question_id === questionSubmission.question_id
      )

      // Create a new answers array
      const newAnswers = [...prev.answers]

      if (existingAnswerIndex >= 0) {
        // Update existing answer
        newAnswers[existingAnswerIndex] = questionSubmission
      } else {
        // Add new answer
        newAnswers.push(questionSubmission)
      }

      return {
        ...prev,
        answers: newAnswers,
      }
    })

    // For debugging - log the current submission state
    console.log('Current submission:', submission)
  }

  // Handle submission of all answers
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{
    message?: string
    score?: number
  } | null>(null)

  const handleSubmit = async () => {
    if (!submission.candidate_id) {
      // For demo purposes, set a placeholder candidate ID
      // In a real app, this would come from authentication
      submission.candidate_id = 'demo-candidate-id'
    }

    setIsSubmitting(true)
    try {
      const result = await submitAnswers(submission)
      setSubmissionResult(result)
      console.log('Submission result:', result)
    } catch (error) {
      console.error('Error submitting answers:', error)
      setSubmissionResult({ message: 'Failed to submit answers. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="p-4 space-y-4">
      {questions.length > 0 ? (
        <>
          {questions.map((question, idx) => (
            <QuestionCard
              key={question._id || idx}
              question={question}
              onAnswerChange={handleAnswerChange}
            />
          ))}

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
        <div className="text-center text-gray-500">
          No questions available. Use the + button to add questions.
        </div>
      )}
    </section>
  )
}
