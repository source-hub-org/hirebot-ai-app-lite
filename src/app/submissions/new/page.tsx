'use client'

import MainLayout from '@/components/layout/MainLayout'
import CandidateSection from '@/components/candidate/CandidateSection'
import QuestionList from '@/components/question/QuestionList'
import AddQuestionPopover from '@/components/question/AddQuestionPopover'
import { CandidateProvider } from '@/contexts/CandidateContext'

export default function NewSubmissionPage() {
  return (
    <MainLayout>
      <CandidateProvider>
        <CandidateSection />
        <QuestionList />
        <AddQuestionPopover />
      </CandidateProvider>
    </MainLayout>
  )
}
