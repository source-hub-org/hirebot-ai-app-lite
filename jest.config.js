/** @type {import('bun:test').BunTestConfig} */
const config = {
  // Use Bun's test runner
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  // Setup files
  preload: ['<rootDir>/jest.setup.js'],
  // Module aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Use Bun's built-in DOM implementation
  environment: 'dom',
}

export default config
