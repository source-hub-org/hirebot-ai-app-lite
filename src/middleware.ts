// Re-export middleware from the middlewares folder
// Next.js requires these specific export names for middleware functionality
import { authMiddleware } from '@/middlewares/authMiddleware'

export default authMiddleware

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp).*)'],
}
