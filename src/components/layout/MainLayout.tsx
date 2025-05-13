// src/components/layout/MainLayout.tsx
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#cccccc] min-h-screen">
      <div className="w-[960px] mx-auto bg-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
