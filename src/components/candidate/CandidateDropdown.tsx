// src/components/candidate/CandidateDropdown.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CandidateDropdown({ disabled }: { disabled: boolean }) {
  // Mock list ứng viên
  const candidates = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C']

  return (
    <div className="min-w-[15rem]">
      <Select disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Chọn ứng viên" />
        </SelectTrigger>
        <SelectContent>
          {candidates.map((c, index) => (
            <SelectItem key={index} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
