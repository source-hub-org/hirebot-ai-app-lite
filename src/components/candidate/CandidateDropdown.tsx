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
    <div className="w-2/3">
      <label className="block mb-1 font-medium">Chọn ứng viên</label>
      <Select disabled={disabled}>
        <SelectTrigger>
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
