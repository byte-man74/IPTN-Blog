import React from 'react'
import { SideNav } from '@/_components/pages/admin-layout/side-nav'
import { auth } from "@/auth"
import { redirect } from 'next/navigation'
import { logger } from '@/lib/utils/logger'
import { Metadata } from 'next'

/**
 * Admin Layout Component
 *
 * This component provides a consistent layout structure for all admin pages.
 * It includes the header with search functionality, notifications, and a sidebar
 * with navigation links to different admin sections.
 */

// Define metadata for admin pages
export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin control panel for managing site content and settings',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    if (!session) {
        logger.info('Unauthorized access attempt to admin area')
        redirect('/login?callbackUrl=/admin')
    }

    // Check if user has admin privileges
    if (!session.user?.isAdmin || !session.user?.isActive) {
        logger.warn(`User ${session.user?.email} attempted to access admin area without privileges`)
        redirect('/unauthorized')
    }

  return (
    <>
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
    </>
  )
}
