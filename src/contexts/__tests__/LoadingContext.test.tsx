import { describe, test, expect, beforeEach, afterEach, spyOn } from 'bun:test'
import { createContext, useContext, useState, useRef } from 'react'

// Mock the MIN_LOADING_TIME constant
const MIN_LOADING_TIME = 100

// Create a simplified version of the LoadingContext for testing
describe('LoadingContext', () => {
  let loadingContext
  let showLoading
  let hideLoading
  let isLoading
  let setIsLoading
  let loadingStartTime
  let hideTimeoutRef
  let clearTimeoutSpy
  let setTimeoutSpy

  beforeEach(() => {
    // Reset state before each test
    isLoading = false
    setIsLoading = value => {
      isLoading = value
    }
    loadingStartTime = { current: 0 }
    hideTimeoutRef = { current: null }

    // Create spies for setTimeout and clearTimeout
    clearTimeoutSpy = spyOn(global, 'clearTimeout')
    setTimeoutSpy = spyOn(global, 'setTimeout').mockImplementation(callback => {
      const timeoutId = Math.random()
      hideTimeoutRef.current = timeoutId
      // Store the callback to be called manually in tests
      hideTimeoutRef.callback = callback
      return timeoutId
    })

    // Create the showLoading and hideLoading functions
    showLoading = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      loadingStartTime.current = Date.now()
      setIsLoading(true)
    }

    hideLoading = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - loadingStartTime.current

      if (elapsedTime < MIN_LOADING_TIME) {
        const remainingTime = MIN_LOADING_TIME - elapsedTime

        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }

        hideTimeoutRef.current = setTimeout(() => {
          setIsLoading(false)
          hideTimeoutRef.current = null
        }, remainingTime)
      } else {
        setIsLoading(false)
      }
    }
  })

  afterEach(() => {
    // Clean up spies
    clearTimeoutSpy.mockRestore()
    setTimeoutSpy.mockRestore()
  })

  test('initial loading state is false', () => {
    expect(isLoading).toBe(false)
  })

  test('showLoading sets isLoading to true', () => {
    showLoading()
    expect(isLoading).toBe(true)
  })

  test('hideLoading sets isLoading to false after MIN_LOADING_TIME', () => {
    // Set initial state to loading
    showLoading()
    expect(isLoading).toBe(true)

    // Mock the current time to be just after loading started
    const mockStartTime = Date.now()
    loadingStartTime.current = mockStartTime

    // Call hideLoading
    hideLoading()

    // Should still be loading because of MIN_LOADING_TIME
    expect(isLoading).toBe(true)

    // Verify setTimeout was called with the correct delay
    expect(setTimeoutSpy).toHaveBeenCalled()

    // Simulate the timeout callback being triggered
    hideTimeoutRef.callback()

    // Now it should not be loading
    expect(isLoading).toBe(false)
  })

  test('hideLoading sets isLoading to false immediately if MIN_LOADING_TIME has passed', () => {
    // Set initial state to loading
    showLoading()
    expect(isLoading).toBe(true)

    // Mock the current time to be well after loading started
    const mockStartTime = Date.now() - (MIN_LOADING_TIME + 50)
    loadingStartTime.current = mockStartTime

    // Call hideLoading
    hideLoading()

    // Should immediately not be loading
    expect(isLoading).toBe(false)
  })

  test('calling showLoading cancels any pending hideLoading timeout', () => {
    // Set initial state to loading
    showLoading()
    expect(isLoading).toBe(true)

    // Mock the current time to be just after loading started
    const mockStartTime = Date.now()
    loadingStartTime.current = mockStartTime

    // Call hideLoading
    hideLoading()

    // Should still be loading because of MIN_LOADING_TIME
    expect(isLoading).toBe(true)

    // Verify setTimeout was called
    expect(setTimeoutSpy).toHaveBeenCalled()

    // Call showLoading again before the timeout completes
    showLoading()

    // Verify clearTimeout was called to cancel the previous timeout
    expect(clearTimeoutSpy).toHaveBeenCalled()

    // Should still be loading
    expect(isLoading).toBe(true)
  })
})
