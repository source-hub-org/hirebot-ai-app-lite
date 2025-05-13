// src/components/question/QuestionCard.tsx
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export default function QuestionCard() {
  return (
    <div className="p-4 border rounded-md space-y-3">
      <div className="font-semibold">Question: Describe an async function in JavaScript?</div>
      <div className="space-y-1">
        <label>
          <input type="checkbox" /> Answer A
        </label>
        <br />
        <label>
          <input type="checkbox" /> Answer B
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Switch />
      </div>
      <Textarea placeholder="Enter your free-form answer..." />
    </div>
  )
}
