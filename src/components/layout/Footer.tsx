// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="p-4 text-center text-sm text-gray-500 border-t bg-gray-50">
      © {new Date().getFullYear()} Company Name. All rights reserved.
    </footer>
  )
}
