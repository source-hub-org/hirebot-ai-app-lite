'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { getSubmissionById } from '@/services/questionsService'
import { useLoading } from '@/hooks/useLoading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface SubmissionQuestion {
  question_id: string
  answer: number | null
  other: string
  point: number
  is_skip: number
  question: {
    _id: string
    question: string
    options: string[]
    correctAnswer: number
    difficulty: string
    category: string
    topic: string
    topic_id: string
  }
}

interface Submission {
  _id: string
  candidate_id: string
  answers: SubmissionQuestion[]
  essay?: {
    question: string | null
    answer: string | null
    is_skip: number
  }
  review?: {
    comment: string
    status: string
  }
  candidate?: {
    _id: string
    full_name: string
    email: string
    phone_number: string
    skills: string[]
    programming_languages: string[]
    interview_level: string
    status: string
  }
}

export default function SubmissionDetailsPage() {
  const params = useParams()
  const submissionId = params?.submission_id as string
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { withLoading } = useLoading()

  // Calculate statistics
  const totalQuestions = submission?.answers.length || 0
  const correctAnswers = submission?.answers.filter(a => a.point > 0).length || 0
  const skippedQuestions = submission?.answers.filter(a => a.is_skip === 1).length || 0
  const scorePercentage =
    totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true)
        const data = await withLoading(() => getSubmissionById(submissionId))

        if (data) {
          setSubmission(Array.isArray(data) ? data[0] : data)
        } else {
          setError('Failed to load submission details')
        }
      } catch (err) {
        setError('An error occurred while fetching the submission')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (submissionId) {
      fetchSubmission().then(() => console.log('fetchSubmission called'))
    }
  }, [submissionId, withLoading])

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4">
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">{error}</div>
        </div>
      </MainLayout>
    )
  }

  if (!submission) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4">
          <div className="p-4 border border-amber-300 bg-amber-50 text-amber-800 rounded-md">
            No submission found with ID: {submissionId}
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Submission Results</h1>

        {/* Candidate Information */}
        {submission.candidate && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{submission.candidate.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{submission.candidate.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{submission.candidate.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="font-medium">{submission.candidate.interview_level || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
            <CardDescription>Overall performance statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="text-2xl font-bold">{totalQuestions}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">Correct Answers</p>
                <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-500">Skipped</p>
                <p className="text-2xl font-bold text-amber-600">{skippedQuestions}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-2xl font-bold text-blue-600">{scorePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions and Answers */}
        <h2 className="text-xl font-semibold mb-4">Questions & Answers</h2>
        <div className="space-y-4">
          {submission.answers.map((item, index) => (
            <Card
              key={item.question_id}
              className={`border-l-4 ${item.point > 0 ? 'border-l-green-500' : item.is_skip ? 'border-l-amber-500' : 'border-l-red-500'}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">
                    {index + 1}. {item.question.question}
                  </CardTitle>
                  <Badge
                    variant={item.point > 0 ? 'success' : item.is_skip ? 'warning' : 'destructive'}
                  >
                    {item.point > 0 ? 'Correct' : item.is_skip ? 'Skipped' : 'Incorrect'}
                  </Badge>
                </div>
                <CardDescription>
                  Difficulty: {item.question.difficulty} | Topic: {item.question.topic}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {item.question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-md ${
                        item.answer === optionIndex && item.answer === item.question.correctAnswer
                          ? 'bg-green-100 border border-green-300'
                          : item.answer === optionIndex &&
                              item.answer !== item.question.correctAnswer
                            ? 'bg-red-100 border border-red-300'
                            : optionIndex === item.question.correctAnswer
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-2 font-medium">
                          {String.fromCharCode(65 + optionIndex)}.
                        </div>
                        <div>{option}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
