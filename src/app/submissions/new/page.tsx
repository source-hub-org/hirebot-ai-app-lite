'use client'

import MainLayout from '@/components/layout/MainLayout'
import CandidateSection from '@/components/candidate/CandidateSection'
import QuestionList from '@/components/question/QuestionList'
import SubmitFooter from '@/components/submission/SubmitFooter'
import AddQuestionPopover from '@/components/question/AddQuestionPopover'

export default function NewSubmissionPage() {
  return (
    <MainLayout>
      <CandidateSection />
      <QuestionList />
      <SubmitFooter />
      <AddQuestionPopover />
    </MainLayout>
  )
}
