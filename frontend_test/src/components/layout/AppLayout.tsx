'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar/navbar'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen">
      <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        {/* Sidebar with transition */}
        <div
          className={cn(
            "fixed left-0 top-14 h-[calc(100vh-3.5rem)] transition-transform duration-300 ease-in-out z-40",
            !isSidebarOpen && "-translate-x-full"
          )}
        >
          <Sidebar />
        </div>

        {/* Main content area that adjusts with sidebar */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out min-h-[calc(100vh-3.5rem)]",
            isSidebarOpen ? "ml-64" : "ml-0"
          )}
          //on click of the main area, the sidebar should close
          onClick={() => setIsSidebarOpen(false)}
        >
          {children}
        </main>
      </div>
    </div>
  )
} 