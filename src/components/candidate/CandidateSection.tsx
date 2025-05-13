// src/components/candidate/CandidateSection.tsx
'use client'

import { useState } from 'react'
import CandidateDropdown from '@/components/candidate/CandidateDropdown'
import CreateCandidateButton from '@/components/candidate/CreateCandidateButton'
import { Button } from '@/components/ui/button'

export default function CandidateSection() {
  const [disabled, setDisabled] = useState(false)

  return (
    <section className="p-4 border-b">
      <div className="flex justify-start items-start gap-x-5 w-full">
        <CandidateDropdown disabled={disabled} />
        <CreateCandidateButton disabled={disabled} />
        <Button
          className="ml-auto cursor-pointer"
          disabled={disabled}
          onClick={() => setDisabled(true)}
        >
          Bắt đầu bài thi
        </Button>
      </div>
    </section>
  )
}
