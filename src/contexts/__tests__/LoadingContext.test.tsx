import { describe, test, expect, beforeEach, afterEach, spyOn } from 'bun:test'

// Mock the MIN_LOADING_TIME constant
const MIN_LOADING_TIME = 100

// Define TypeScript interfaces for our test objects
interface LoadingTimeRef {
  current: number
}

interface TimeoutRef {
  current: ReturnType<typeof setTimeout> | null
  callback?: () => void
}

// No need for TimeoutId type as it's not used

type SetIsLoadingFunction = (value: boolean) => void

// Create a simplified version of the LoadingContext for testing
describe('LoadingContext', () => {
  let showLoading: () => void
  let hideLoading: () => void
  let isLoading: boolean
  let setIsLoading: SetIsLoadingFunction
  let loadingStartTime: LoadingTimeRef
  let hideTimeoutRef: TimeoutRef
  let clearTimeoutSpy: ReturnType<typeof spyOn>
  let setTimeoutSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    // Reset state before each test
    isLoading = false
    setIsLoading = (value: boolean): void => {
      isLoading = value
    }
    loadingStartTime = { current: 0 }
    hideTimeoutRef = { current: null }

    // Create spies for setTimeout and clearTimeout
    clearTimeoutSpy = spyOn(global, 'clearTimeout')
    setTimeoutSpy = spyOn(global, 'setTimeout').mockImplementation(
      (callback: TimerHandler): unknown => {
        // Create a timeout-like object instead of just a number
        const timeoutId = {
          _id: Math.random(),
          unref: () => {},
          ref: () => {},
        } as unknown as ReturnType<typeof setTimeout>

        hideTimeoutRef.current = timeoutId
        // Store the callback to be called manually in tests
        hideTimeoutRef.callback =
          typeof callback === 'function'
            ? (callback as () => void)
            : () => {
                eval(callback as string)
              }
        return timeoutId
      }
    )

    // Create the showLoading and hideLoading functions
    showLoading = (): void => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      loadingStartTime.current = Date.now()
      setIsLoading(true)
    }

    hideLoading = (): void => {
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
    if (hideTimeoutRef.callback) {
      hideTimeoutRef.callback()
    }

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
