// src/components/layout/MainLayout.tsx
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="site-container w-[1024px] mx-auto bg-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
