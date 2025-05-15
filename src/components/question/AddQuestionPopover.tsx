'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getTopics } from '@/services/topics.service'
import { getLanguages } from '@/services/languages.service'
import { getPositions } from '@/services/positions.service'
import { searchQuestions } from '@/services/questions.service'
import { Topic, Language, Position } from '@/types/api'
import { useCandidateContext } from '@/contexts/CandidateContext'

export default function AddQuestionPopover() {
  const { candidateId } = useCandidateContext();
  const [open, setOpen] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState({
    topics: false,
    languages: false,
    positions: false,
  })

  // Selected values
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedPosition, setSelectedPosition] = useState<string>('')
  const [pageSize, setPageSize] = useState<string>('')

  // Fetch data when the popover opens
  useEffect(() => {
    if (open) {
      fetchData()
    }
  }, [open])

  const fetchData = async () => {
    try {
      setIsLoading({ topics: true, languages: true, positions: true })

      // Fetch topics
      const topicsData = await getTopics()
      setTopics(topicsData)

      // Fetch languages
      const languagesData = await getLanguages({ limit: 100 })
      setLanguages(languagesData.languages)

      // Fetch positions
      const positionsData = await getPositions({ limit: 100 })
      setPositions(positionsData.positions)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading({ topics: false, languages: false, positions: false })
    }
  }

  const handleAddQuestions = async () => {
    // Prepare data for API call
    const formData = {
      topic: selectedTopic,
      language: selectedLanguage,
      position: selectedPosition,
      page_size: parseInt(pageSize),
    }

    console.log('Form data:', formData)

    try {
      // Call the searchQuestions API
      const { questions } = await searchQuestions(formData)

      // Use a custom event to pass the questions to the QuestionList component
      const event = new CustomEvent('questionsLoaded', {
        detail: { questions },
      })
      window.dispatchEvent(event)

      // Close the popover
      setOpen(false)
    } catch (error) {
      console.error('Error searching questions:', error)
    }
  }

  // Handle clicks inside the popover to prevent it from closing when interacting with MultiSelect
  const handlePopoverClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Handle popover open/close manually
  const handleOpenChange = (isOpen: boolean) => {
    // Set the open state based on the isOpen parameter
    // This will handle both opening and closing
    setOpen(isOpen)
  }

  // Handle cancel button click
  const handleCancel = () => {
    setOpen(false)
  }

  if (!candidateId) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 rounded cursor-pointer"
          variant="default"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[400px] space-y-4 mr-[20px] mb-[15px]"
        sideOffset={5}
        onClick={handlePopoverClick}
      >
        <div className="space-y-2">
          <h4 className="font-medium leading-none">More questions</h4>
          <p className="text-sm text-muted-foreground">Use filters to find and add questions.</p>
        </div>

        <div className="flex items-center">
          <div className="w-1/3">
            <Label>Select Topic</Label>
          </div>
          <div className="w-2/3">
            <Select
              value={selectedTopic}
              onValueChange={setSelectedTopic}
              disabled={isLoading.topics}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoading.topics ? 'Loading...' : 'Select topic'} />
              </SelectTrigger>
              <SelectContent>
                {topics.map(topic => (
                  <SelectItem key={topic._id || topic.title} value={topic._id || topic.title}>
                    {topic.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-1/3">
            <Label>Select Language</Label>
          </div>
          <div className="w-2/3">
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
              disabled={isLoading.languages}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoading.languages ? 'Loading...' : 'Select language'} />
              </SelectTrigger>
              <SelectContent>
                {languages.map(language => (
                  <SelectItem
                    key={language._id || language.name}
                    value={language._id || language.name}
                  >
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-1/3">
            <Label>Select Position</Label>
          </div>
          <div className="w-2/3">
            <Select
              value={selectedPosition}
              onValueChange={setSelectedPosition}
              disabled={isLoading.positions}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoading.positions ? 'Loading...' : 'Select position'} />
              </SelectTrigger>
              <SelectContent>
                {positions.map(position => (
                  <SelectItem
                    key={position._id || position.slug}
                    value={position._id || position.slug}
                  >
                    {position.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-1/3">
            <Label>Page size</Label>
          </div>
          <div className="w-2/3">
            <Select value={pageSize} onValueChange={setPageSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select number of questions" />
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
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleAddQuestions}>Add Questions</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
