// src/components/question/QuestionList.tsx
import QuestionCard from '@/components/question/QuestionCard'

export default function QuestionList() {
  // mock list of questions
  const questions = [1, 2, 3]
  return (
    <section className="p-4 space-y-4">
      {questions.map((q, idx) => (
        <QuestionCard key={idx} />
      ))}
    </section>
  )
}
