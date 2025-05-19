'use client'

import MainLayout from '@/components/layout/MainLayout'
import QuestionList from '@/components/question/QuestionList'
import AddQuestionPopover from '@/components/question/AddQuestionPopover'

export default function NewSubmissionPage() {
  return (
    <MainLayout>
      <QuestionList />
      <AddQuestionPopover />
    </MainLayout>
  )
}
