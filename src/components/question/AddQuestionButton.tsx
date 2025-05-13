// src/components/question/AddQuestionButton.tsx
'use client'

import { useState } from 'react'
import AddQuestionModal from '@/components/question/AddQuestionModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AddQuestionButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button className="fixed bottom-6 right-6 z-50" onClick={() => setOpen(true)}>
        <Plus className="mr-2" size={16} />
        Thêm câu hỏi
      </Button>
      <AddQuestionModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
