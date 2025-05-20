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
import { useEffect, useState, useCallback } from 'react'
import { getTopics } from '@/services/topicsService'
import { getLanguages } from '@/services/languagesService'
import { getPositions } from '@/services/positionsService'
import { Topic, Language, Position } from '@/types/api'
import { useQuestions } from '@/hooks/useQuestions'
import { useLoading } from '@/hooks/useLoading'

export default function AddQuestionPopover() {
  const { withLoading } = useLoading()
  const [open, setOpen] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [formLoading, setFormLoading] = useState({
    topics: false,
    languages: false,
    positions: false,
  })

  // Selected values
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedPosition, setSelectedPosition] = useState<string>('')
  const [pageSize, setPageSize] = useState<string>('')

  const fetchData = useCallback(async () => {
    setFormLoading({ topics: true, languages: true, positions: true })

    try {
      await withLoading(async () => {
        // Fetch topics
        const topicsData = await getTopics()
        setTopics(topicsData)

        // Fetch languages
        const languagesData = await getLanguages({ limit: 100 })
        setLanguages(languagesData.languages)

        // Fetch positions
        const positionsData = await getPositions({ limit: 100 })
        setPositions(positionsData.positions)
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setFormLoading({ topics: false, languages: false, positions: false })
    }
  }, [withLoading])

  // Fetch data when the popover opens
  useEffect(() => {
    if (open) {
      fetchData().then(() => console.log('fetchData called'))
    }
  }, [open])

  // Use the question hook for state management
  const { searchQuestions, isSearching, searchError } = useQuestions()

  const handleAddQuestions = useCallback(async () => {
    // Prepare data for API call
    const formData = {
      topic_id: selectedTopic || '',
      language_id: selectedLanguage || '',
      position_id: selectedPosition || '',
      page_size: parseInt(pageSize) || 10,
    }

    // Call the searchQuestions mutation with the loading indicator
    await withLoading(async () => {
      searchQuestions(formData)

      // Close the popover only if there's no error
      if (!searchError) {
        setOpen(false)
      }
    })
  }, [
    selectedTopic,
    selectedLanguage,
    selectedPosition,
    pageSize,
    withLoading,
    searchQuestions,
    searchError,
    setOpen,
  ])

  // Handle clicks inside the popover to prevent it from closing when interacting with MultiSelect
  const handlePopoverClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  // Handle popover open/close manually
  const handleOpenChange = useCallback((isOpen: boolean) => {
    // Set the open state based on the isOpen parameter
    // This will handle both opening and closing
    setOpen(isOpen)
  }, [])

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button className="fixed top-5 right-5 rounded cursor-pointer" variant="default">
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[400px] space-y-4 mr-[15px] mt-[5px]"
        sideOffset={5}
        onClick={handlePopoverClick}
      >
        <div className="space-y-2">
          <h4 className="font-medium leading-none">More questions</h4>
          <p className="text-muted-foreground">Use filters to find and add questions.</p>
        </div>

        <div className="flex items-center">
          <div className="w-1/3">
            <Label>Select Topic</Label>
          </div>
          <div className="w-2/3">
            <Select
              value={selectedTopic}
              onValueChange={setSelectedTopic}
              disabled={formLoading.topics}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={formLoading.topics ? 'Loading...' : 'Select topic'} />
              </SelectTrigger>
              <SelectContent>
                {topics.map(topic => (
                  <SelectItem
                    key={topic._id || topic.title}
                    value={String(topic._id || topic.title)}
                  >
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
              disabled={formLoading.languages}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={formLoading.languages ? 'Loading...' : 'Select language'}
                />
              </SelectTrigger>
              <SelectContent>
                {languages.map(language => (
                  <SelectItem
                    key={language._id || language.name}
                    value={String(language._id || language.name)}
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
              disabled={formLoading.positions}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={formLoading.positions ? 'Loading...' : 'Select position'}
                />
              </SelectTrigger>
              <SelectContent>
                {positions.map(position => (
                  <SelectItem
                    key={position._id || position.slug}
                    value={String(position._id || position.slug)}
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
          <Button variant="outline" onClick={handleCancel} disabled={isSearching}>
            Cancel
          </Button>
          <Button
            onClick={handleAddQuestions}
            disabled={
              isSearching || formLoading.topics || formLoading.languages || formLoading.positions
            }
          >
            {isSearching ? 'Searching...' : 'Add Questions'}
          </Button>
        </div>

        {/* Show an error message if the search fails */}
        {searchError && (
          <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded border border-red-200">
            Error: {(searchError as Error).message}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
