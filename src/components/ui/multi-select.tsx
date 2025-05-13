'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { Command as CommandPrimitive } from 'cmdk'
import { cn } from '@/lib/utils'

export type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: Option[]
  onChange: (selected: Option[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select items...',
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const handleUnselect = (option: Option) => {
    onChange(selected.filter(s => s.value !== option.value))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '' && selected.length > 0) {
          onChange(selected.slice(0, -1))
        }
      }
      // This is not a default behavior of the <input /> field
      if (e.key === 'Escape') {
        input.blur()
      }
    }
  }

  // Filter out options that are already selected
  const selectables = options.filter(option => !selected.some(s => s.value === option.value))

  // Handle clicking on the container to focus the input
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
      setOpen(true)
    }
  }

  return (
    <Command onKeyDown={handleKeyDown} className={cn('overflow-visible bg-transparent', className)}>
      <div
        className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text"
        onClick={handleContainerClick}
      >
        <div className="flex gap-1 flex-wrap">
          {selected.map(option => (
            <Badge key={option.value} variant="secondary" className="mb-1">
              {option.label}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleUnselect(option)
                  }
                }}
                onMouseDown={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={e => {
                  e.stopPropagation()
                  handleUnselect(option)
                }}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => {
              // Delay closing to allow for item selection
              setTimeout(() => setOpen(false), 300)
            }}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : undefined}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 min-w-[50px]"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && options.length > 0 ? (
          <div className="absolute w-full z-50 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-[200px]">
              {selectables.length > 0 ? (
                selectables.map(option => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={e => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      setInputValue('')
                      onChange([...selected, option])
                      // Keep focus on input after selection
                      if (inputRef.current) {
                        inputRef.current.focus()
                      }
                      // Don't close the dropdown
                      setOpen(true)
                    }}
                    onSelect={() => {
                      setInputValue('')
                      onChange([...selected, option])
                      // Keep focus on input after selection
                      if (inputRef.current) {
                        inputRef.current.focus()
                      }
                      // Don't close the dropdown
                      setOpen(true)
                    }}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))
              ) : (
                <div className="py-2 px-3 text-sm text-muted-foreground">
                  No more options available
                </div>
              )}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}
