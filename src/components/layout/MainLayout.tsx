'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoadingComponent from '@/components/common/LoadingComponent'
import { usePathname } from 'next/navigation'
import { getPageConfig } from '@/config/pageConfig'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/'
  const { title, description } = getPageConfig(pathname)

  return (
    <div className="min-h-screen">
      <div className="site-container w-[1024px] mx-auto bg-white min-h-screen flex flex-col">
        <LoadingComponent />
        <Header pageTitle={title} pageDescription={description} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
