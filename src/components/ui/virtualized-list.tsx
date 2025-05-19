'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { cn } from '@/libs/utils'

interface VirtualizedListProps<T> {
  items: T[]
  height: number
  itemHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscan?: number
}

export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className,
  overscan = 5,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)

  // Calculate the total height
  const totalHeight = items.length * itemHeight

  // Calculate the start and end indices of the visible items
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + height) / itemHeight) + overscan
  )

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop)
    }
  }, [])

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  // Render only the visible items
  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => {
    const actualIndex = startIndex + index
    return (
      <div
        key={actualIndex}
        style={{
          position: 'absolute',
          top: actualIndex * itemHeight,
          height: itemHeight,
          left: 0,
          right: 0,
        }}
      >
        {renderItem(item, actualIndex)}
      </div>
    )
  })

  return (
    <div ref={containerRef} className={cn('overflow-auto relative', className)} style={{ height }}>
      <div style={{ height: totalHeight, position: 'relative' }}>{visibleItems}</div>
    </div>
  )
}
