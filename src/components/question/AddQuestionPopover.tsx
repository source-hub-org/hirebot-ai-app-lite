'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function AddQuestionPopover() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="fixed bottom-4 right-4 rounded cursor-pointer" variant="default">
          <Plus className="h-4 w-4" />
          {/* Thêm câu hỏi */}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] space-y-4">
        <div>
          <Label>Chọn topic (nhiều)</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {['HTML', 'CSS', 'React', 'Node.js'].map(topic => (
              <div key={topic} className="flex items-center gap-2">
                <Checkbox id={topic} />
                <label htmlFor={topic}>{topic}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Chọn language (nhiều)</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {['JavaScript', 'Python', 'Go'].map(lang => (
              <div key={lang} className="flex items-center gap-2">
                <Checkbox id={lang} />
                <label htmlFor={lang}>{lang}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Chọn position (1)</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Chọn vị trí" />
            </SelectTrigger>
            <SelectContent>
              {['Frontend', 'Backend', 'Fullstack'].map(p => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Page size</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Chọn số câu hỏi" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-right">
          <Button onClick={() => setOpen(false)}>Thêm câu hỏi</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
