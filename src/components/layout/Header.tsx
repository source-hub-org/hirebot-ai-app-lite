/**
 * Header layout includes the following components:
 *
 * 1. Top-bar:
 *    - Left side: Navigation links (Home, About, Contact)
 *    - Right side: Login link (static, no authentication logic yet)
 *
 * 2. Hero Image:
 *    - A full-width cover image with fixed height
 *    - A semi-transparent dark overlay above the image to enhance text visibility
 *    - Overlaid content on the left side, vertically centered:
 *        - Page Title (large text)
 *        - Page Description (smaller subtitle below title)
 *
 * 3. Breadcrumb:
 *    - Placed below the hero image
 *    - Displays the current navigation path, such as: Home / Create
 */

import React from 'react'
import Image from 'next/image'

const Header: React.FC = () => {
  return (
    <div className="w-full">
      {/* Top-bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-black font-medium">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-black font-medium">
            About
          </a>
          <a href="#" className="text-gray-700 hover:text-black font-medium">
            Contact
          </a>
        </div>
        <div>
          <a href="#" className="text-gray-700 hover:text-black font-medium">
            Login
          </a>
        </div>
      </div>

      {/* Hero Image with overlay content */}
      <div className="relative w-full h-[360px]">
        <Image src="/cover.png" alt="Hero Cover" fill className="object-cover" priority />
        {/* Overlay layer */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Text Content */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 text-white max-w-md z-10">
          <h1 className="text-4xl font-bold mb-2">Create new test</h1>
          <p className="text-lg text-gray-200">
            Start building your custom test from scratch with our intuitive interface.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-3 bg-gray-100 text-sm text-gray-600">Home / Submissions / New</div>
    </div>
  )
}

export default Header
