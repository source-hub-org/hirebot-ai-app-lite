// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { mock } from 'bun:test'

// Mock the next/navigation functions
mock('next/navigation', () => ({
  useRouter: () => ({
    push: () => {},
    replace: () => {},
    prefetch: () => {},
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}))

// Set up environment variables for testing
process.env.NEXT_PUBLIC_MIN_LOADING_TIME = '500'
