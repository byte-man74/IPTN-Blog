'use client'

import React, { useState, useEffect } from 'react'
import {
  Home,
  FileText,
  MessageSquare,
  Settings,
  BarChart2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { AppLink } from '@/_components/global/app-link'
import { usePathname } from 'next/navigation'
import { AppLogo } from '@/_components/global/app-logo'

/**
 * SideNav Component
 *
 * This component renders the sidebar navigation for the admin layout.
 * It displays navigation links to different sections of the admin dashboard
 * and highlights the active link based on the current path.
 * The sidebar can be collapsed to save screen space, and this state is persisted in localStorage.
 * The dark background improves contrast for better readability.
 */
export const SideNav = () => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Always perform nullish check for data coming from hook
  const currentPath = pathname ?? ''

  /**
   * Navigation items configuration
   * Each item defines a route in the admin sidebar with its path, label, and icon
   */
  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: Home,
      matchPath: (path: string) => path === '/admin',
    },
    {
      href: '/admin/posts',
      label: 'Posts',
      icon: FileText,
      matchPath: (path: string) => path.startsWith('/admin/posts'),
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      icon: MessageSquare,
      matchPath: (path: string) => path.startsWith('/admin/categories'),
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: BarChart2,
      matchPath: (path: string) => path.startsWith('/admin/analytics'),
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings,
      matchPath: (path: string) => path.startsWith('/admin/settings'),
    },
  ]

  // Load collapse state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('sideNavCollapsed')
    // Only update state if we have a saved value
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true')
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    // Save collapse state to localStorage
    localStorage.setItem('sideNavCollapsed', String(newState))
  }

  return (
    <div className="hidden md:flex md:flex-shrink-0 relative">
      <div
        className={`flex flex-col border-r border-gray-700 bg-[#1E1E1E] shadow-lg transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Collapse button positioned at the top of the sidebar */}
        <div className="pt-5 px-2 flex justify-end">
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:ring-opacity-50 bg-black hover:bg-[#1E1E1E] p-2 rounded-md transition-all duration-200"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="h-0 flex-1 flex flex-col pt-4 pb-6 overflow-y-auto">
          <div className={`flex justify-center mb-6 ${isCollapsed ? 'px-1' : 'px-4'}`}>
            <AppLogo
              variant="white"
              width={isCollapsed ? 240 : 120}
              height={40}
              className={`transition-all duration-300 ${isCollapsed ? 'scale-90' : ''}`}
            />
          </div>
          <nav className="mt-2 flex-1 px-2 bg-[#1E1E1E] space-y-2">
            {navItems.map((item) => {
              const isActive = item.matchPath(currentPath)
              const Icon = item.icon

              return (
                <AppLink
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primaryGreen text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`${isCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </AppLink>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
