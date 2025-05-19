'use client'

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { cn } from '@/libs/utils'

interface VirtualizedListProps<T> {
  items: T[]
  height: number
  itemHeight: number // Now used as an estimated average height
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
  const itemsRef = useRef<Map<number, HTMLDivElement>>(new Map())
  const [scrollTop, setScrollTop] = useState(0)
  const [itemHeights, setItemHeights] = useState<number[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize with estimated heights
  useEffect(() => {
    if (!isInitialized && items.length > 0) {
      setItemHeights(Array(items.length).fill(itemHeight))
      setIsInitialized(true)
    }
  }, [items.length, itemHeight, isInitialized])

  // Calculate item positions based on their actual heights
  const itemPositions = useMemo(() => {
    const positions: number[] = [0]
    let currentPosition = 0

    for (let i = 0; i < itemHeights.length - 1; i++) {
      currentPosition += itemHeights[i]
      positions.push(currentPosition)
    }
    return positions
  }, [itemHeights])

  // Calculate the total height
  const totalHeight = useMemo(() => {
    return itemHeights.reduce((sum, height) => sum + height, 0)
  }, [itemHeights])

  // Find the visible range of items
  const visibleRange = useMemo(() => {
    if (itemPositions.length === 0) {
      return { startIndex: 0, endIndex: Math.min(items.length - 1, 10) }
    }

    // Find the first item that starts after the current scroll position - overscan
    let startIndex = 0
    while (
      startIndex < itemPositions.length - 1 &&
      itemPositions[startIndex + 1] < scrollTop - itemHeight * overscan
    ) {
      startIndex++
    }

    // Find the first item that starts after the current viewport + overscan
    let endIndex = startIndex
    while (
      endIndex < itemPositions.length - 1 &&
      itemPositions[endIndex] < scrollTop + height + itemHeight * overscan
    ) {
      endIndex++
    }

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex: Math.min(items.length - 1, endIndex + overscan),
    }
  }, [scrollTop, height, itemPositions, items.length, itemHeight, overscan])

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

  // Measure item heights after render
  useEffect(() => {
    const measureHeights = () => {
      const newHeights = [...itemHeights]
      let hasChanges = false

      itemsRef.current.forEach((element, index) => {
        const actualHeight = element.getBoundingClientRect().height
        if (Math.abs(actualHeight - newHeights[index]) > 1) {
          newHeights[index] = actualHeight
          hasChanges = true
        }
      })

      if (hasChanges) {
        setItemHeights(newHeights)
      }
    }

    // Use ResizeObserver to detect size changes in items
    const resizeObserver = new ResizeObserver(() => {
      measureHeights()
    })

    itemsRef.current.forEach(element => {
      resizeObserver.observe(element)
    })

    // Initial measurement
    measureHeights()

    return () => {
      resizeObserver.disconnect()
    }
  }, [visibleRange, itemHeights])

  // Render only the visible items
  const visibleItems = useMemo(() => {
    return items
      .slice(visibleRange.startIndex, visibleRange.endIndex + 1)
      .map((item, relativeIndex) => {
        const actualIndex = visibleRange.startIndex + relativeIndex
        return (
          <div
            key={actualIndex}
            ref={el => {
              if (el) {
                itemsRef.current.set(actualIndex, el)
              } else {
                itemsRef.current.delete(actualIndex)
              }
            }}
            style={{
              position: 'absolute',
              top: itemPositions[actualIndex],
              left: 0,
              right: 0,
              minHeight: itemHeights[actualIndex],
            }}
          >
            {renderItem(item, actualIndex)}
          </div>
        )
      })
  }, [items, visibleRange, itemPositions, itemHeights, renderItem])

  return (
    <div ref={containerRef} className={cn('overflow-auto relative', className)} style={{ height }}>
      <div style={{ height: totalHeight, position: 'relative' }}>{visibleItems}</div>
    </div>
  )
}
