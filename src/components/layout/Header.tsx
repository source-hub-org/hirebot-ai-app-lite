'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthProvider'
import { Button } from '@/components/ui/button'
import { Lock, Unlock } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
interface HeaderProps {
  pageTitle: string
  pageDescription: string
}

const Header: React.FC<HeaderProps> = ({ pageTitle, pageDescription }) => {
  const { user, logout, isAuthenticated } = useAuthContext()
  return (
    <div className="w-full">
      {/* Top-bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-black text-base">
            Home
          </Link>
          <Link href="/about" className="hover:text-black text-base">
            About
          </Link>
          <Link href="/contact" className="hover:text-black text-base">
            Contact
          </Link>
          <Link href="/submissions/new" className="hover:text-black text-base underline">
            Take a quiz
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <Link href="/login">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="font-semibold rounded-md transition-colors duration-300 ease-in-out cursor-pointer flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign in to your account</p>
                </TooltipContent>
              </Tooltip>
            </Link>
          ) : (
            <>
              <span className="text-base">
                Look who&apos;s here –{' '}
                <i>{user?.username || user?.email?.split('@')[0] || 'Anonymous'}</i> in the house!
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      if (confirm('Are you sure you want to logout?')) {
                        logout()
                        // No need to manually redirect, the logout function will handle it
                      }
                    }}
                    className="font-semibold rounded-md transition-colors duration-300 ease-in-out cursor-pointer flex items-center gap-2"
                  >
                    <Unlock className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign out of your account</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      {/* Hero Image with overlay content */}
      <div className="relative w-full h-[360px]">
        <Image
          src="/cover.png"
          alt="Hero Cover"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay layer */}
        <div className="absolute inset-0 bg-black opacity-60" />

        {/* Text Content */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 text-white max-w-1/2 z-10">
          <h1 className="font-bold mb-2 text-[3rem]">{pageTitle}</h1>
          <p className="text-gray-200 text-base">{pageDescription}</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-3 bg-gray-100 text-gray-600 text-base">
        <BreadcrumbNav />
      </div>
    </div>
  )
}
// BreadcrumbNav component to display the current path
const BreadcrumbNav: React.FC = () => {
  const pathname = usePathname()

  // Skip the first empty segment and format the path segments
  const segments = (pathname ?? '').split('/').filter(segment => segment !== '')

  return (
    <div className="flex items-center">
      <Link href="/" className="hover:text-black">
        Home
      </Link>
      {segments.map((segment, index) => {
        // Build the path up to this segment
        const path = `/${segments.slice(0, index + 1).join('/')}`

        // Capitalize the first letter of each segment
        const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1)

        return (
          <React.Fragment key={path}>
            <span className="mx-2">/</span>
            <Link href={path} className="hover:text-black">
              {formattedSegment}
            </Link>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Header
