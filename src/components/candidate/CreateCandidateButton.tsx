// src/components/candidate/CreateCandidateButton.tsx
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export default function CreateCandidateButton({ disabled }: { disabled: boolean }) {
  return (
    <Button className="cursor-pointer" variant="outline" disabled={disabled}>
      <PlusCircle className="mr-2" size={16} />
      Create new
    </Button>
  )
}
