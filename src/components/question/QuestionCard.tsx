// src/components/question/QuestionCard.tsx
import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Question } from '@/types/api'

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
  const [submission, setSubmission] = useState<AnswerSubmission>({
    question_id: question._id || '',
    answer: null,
    other: '',
    point: 0,
    is_skip: 0,
  })

  // Update submission when user interacts with the question
  useEffect(() => {
    const newSubmission = {
      ...submission,
      answer: selectedOption,
      other: otherAnswer,
      is_skip: showExplanation ? 1 : 0,
    }

    setSubmission(newSubmission)

    // Notify parent component if callback is provided
    if (onAnswerChange) {
      onAnswerChange(newSubmission)
    }
  }, [selectedOption, otherAnswer, showExplanation])

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
      <div className='mb-10'>
        <p className="font-semibold">Question:</p>
        <p>{question.question}</p>
      </div>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-start space-x-2 mb-2">
            <Checkbox
              id={`question-${question._id}-option-${index}`}
              checked={selectedOption === index}
              onCheckedChange={() => handleOptionSelect(index)}          
            />
            <label
              htmlFor={`question-${question._id}-option-${index}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
      <div className="flex items-center gap-2">
        <Switch checked={showExplanation} onCheckedChange={handleExplanationToggle} />
        <span className="text-sm">Show explanation</span>
      </div>
      {showExplanation && (
        <div className="bg-gray-50 p-3 rounded-md text-sm whitespace-pre-line">{question.explanation}</div>
      )}
      <Textarea
        placeholder="Enter your free-form answer..."
        value={otherAnswer}
        onChange={handleTextChange}
      />
    </div>
  )
}
