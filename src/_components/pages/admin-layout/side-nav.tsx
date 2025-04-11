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
  LogOut,
  User,
} from 'lucide-react'
import { AppLink } from '@/_components/global/app-link'
import { usePathname } from 'next/navigation'
import { AppLogo } from '@/_components/global/app-logo'
import { useSession, signOut } from 'next-auth/react'
import { AppImage } from '@/_components/global/app-image'
import { AdminRoutes } from '@/lib/routes/admin'

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
  const { data: session } = useSession()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Always perform nullish check for data coming from hook
  const currentPath = pathname ?? ''

  /**
   * Navigation items configuration
   * Each item defines a route in the admin sidebar with its path, label, and icon
   */
  const navItems = [
    {
      href: `${AdminRoutes.home}`,
      label: 'Dashboard',
      icon: Home,
      matchPath: (path: string) => path === `${AdminRoutes.home}`,
    },
    {
      href: `${AdminRoutes.news}`,
      label: 'Posts',
      icon: FileText,
      matchPath: (path: string) => path.startsWith(`${AdminRoutes.news}`),
    },
    {
      href: `${AdminRoutes.categories}`,
      label: 'Categories',
      icon: MessageSquare,
      matchPath: (path: string) => path.startsWith(`${AdminRoutes.categories}`),
    },
    {
      href: `${AdminRoutes.analytics}/`,
      label: 'Analytics',
      icon: BarChart2,
      matchPath: (path: string) => path.startsWith(`${AdminRoutes.analytics}`),
    },
    {
      href: `${AdminRoutes.settings}`,
      label: 'Settings',
      icon: Settings,
      matchPath: (path: string) => path.startsWith(`${AdminRoutes.settings}`),
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

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' })
  }

  const toggleLogoutConfirm = () => {
    setShowLogoutConfirm(!showLogoutConfirm)
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
            className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:ring-opacity-50 bg-black hover:bg-[#1E1E1E] p-2  transition-all duration-200"
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
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium  transition-all duration-200 ${
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

          {/* User info and logout section */}
          <div className="mt-auto px-2">
            {session?.user && (
              <div className="relative">
                <button
                  onClick={toggleLogoutConfirm}
                  className={`w-full mb-3 px-4 py-3 rounded-md bg-[#2A2A2A] hover:bg-[#333333] transition-colors flex justify-center items-end ${isCollapsed ? 'text-center' : ''}`}
                >
                  <div className="flex items-center">
                    <div className={`flex-shrink-0  ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                      {session.user.image ? (
                        <div className="rounded-full border-2 border-primaryGreen p-0.5">
                          <AppImage
                            src={session.user.image}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-primaryGreen to-green-600 p-2 rounded-full shadow-md">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                    {!isCollapsed && (
                      <div className="text-sm text-gray-200 text-left">
                        <div className="font-bold text-white">
                          {session.user.firstName} {session.user.lastName}
                        </div>
                        <div className="text-xs text-gray-400 truncate mt-0.5">{session.user.email}</div>
                        {session.user.isAdmin && (
                          <div className="mt-1">
                            <span className="bg-primaryGreen/20 text-primaryGreen text-xs px-2 py-0.5 rounded-full font-medium">
                              Admin
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </button>

                {/* Logout confirmation popup */}
                {showLogoutConfirm && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#2A2A2A] rounded-lg shadow-lg border border-gray-700 p-3 z-10">
                    <p className="text-sm text-gray-200 mb-3">Are you sure you want to logout?</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleLogout}
                        className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors flex items-center justify-center"
                      >
                        <LogOut className="h-4 w-4 mr-1.5" />
                        Logout
                      </button>
                      <button
                        onClick={toggleLogoutConfirm}
                        className="flex-1 py-1.5 px-3 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
