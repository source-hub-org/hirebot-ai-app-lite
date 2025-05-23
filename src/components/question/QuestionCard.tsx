// src/components/question/QuestionCard.tsx
import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Question } from '@/types/api'
import CodeQuestionViewerProps from '@/components/question/CodeQuestionViewer'

interface QuestionCardProps {
  question: Question
  onAnswerChange?: (submission: AnswerSubmission) => void
}

interface AnswerSubmission {
  question_id: string
  answer: number | null
  other: string
  point: number
  is_skip: number
}

export default function QuestionCard({ question, onAnswerChange }: QuestionCardProps) {
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [otherAnswer, setOtherAnswer] = useState('')
  const [, setSubmission] = useState<AnswerSubmission>({
    question_id: question._id || '',
    answer: null,
    other: '',
    point: 0,
    is_skip: 0,
  })

  // Update submission when user interacts with the question
  useEffect(() => {
    const newSubmission = {
      question_id: question._id || '',
      answer: selectedOption,
      other: otherAnswer,
      point: 0,
      is_skip: showExplanation ? 1 : 0,
    }

    setSubmission(newSubmission)

    // Notify the parent component if a callback is provided
    if (onAnswerChange) {
      onAnswerChange(newSubmission)
    }
  }, [selectedOption, otherAnswer, showExplanation, question._id, onAnswerChange])

  // Handle option selection
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index === selectedOption ? null : index)
  }

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherAnswer(e.target.value)
  }

  // Handle explanation toggle
  const handleExplanationToggle = (checked: boolean) => {
    setShowExplanation(checked)
  }

  return (
    <div className="p-4 border rounded-md space-y-3">
      <div className="question-text markdown-content font-medium">
        <CodeQuestionViewerProps
          content={question.question}
          language={question?.language?.toLowerCase()}
        ></CodeQuestionViewerProps>
      </div>
      <div className="space-y-2 mt-10">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-start space-x-2 mb-2">
            <Checkbox
              id={`question-${question._id}-option-${index}`}
              checked={selectedOption === index}
              onCheckedChange={() => handleOptionSelect(index)}
            />
            <label
              htmlFor={`question-${question._id}-option-${index}`}
              className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option}
            </label>
            {Array.isArray(question.correct_answer)
              ? question.correct_answer.includes(index)
              : question.correct_answer === index
                ? showExplanation && <span className="text-green-500 ml-2">(Correct)</span>
                : null}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-10">
        <Switch checked={showExplanation} onCheckedChange={handleExplanationToggle} />
        <span>Show explanation</span>
      </div>
      {showExplanation && (
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="question-text markdown-content">
            <CodeQuestionViewerProps content={question.explanation}></CodeQuestionViewerProps>
          </div>
        </div>
      )}
      <Textarea
        placeholder="Enter your free-form answer..."
        value={otherAnswer}
        onChange={handleTextChange}
      />
      {/* Display question metadata */}
      {(question.language || question.position || question.topic) && (
        <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap gap-2">
          {question.language && (
            <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
              Language: {question.language}
            </div>
          )}
          {question.position && (
            <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
              Position: {question.position}
            </div>
          )}
          {question.topic && (
            <div className="bg-green-50 text-green-700 px-2 py-1 rounded">
              Topic: {question.topic}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
