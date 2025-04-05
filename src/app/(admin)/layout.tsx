import React from 'react'
import { SideNav } from '@/_components/pages/admin-layout/side-nav'

/**
 * Admin Layout Component
 *
 * This component provides a consistent layout structure for all admin pages.
 * It includes the header with search functionality, notifications, and a sidebar
 * with navigation links to different admin sections.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="flex h-screen overflow-hidden sticky z-20 top-10">
        {/* Sidebar */}
        <SideNav />

        {/* Main content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <div className="flex">{children ?? <div>Loading...</div>}</div>{' '}
          </div>
        </main>
      </div>
    </div>
  )
}
