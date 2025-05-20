// Re-export middleware from the middlewares folder
// Next.js requires these specific export names for middleware functionality
export { authMiddleware as middleware, authConfig as config } from './middlewares/authMiddleware'
