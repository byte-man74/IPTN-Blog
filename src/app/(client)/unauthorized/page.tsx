'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ShieldAlert, ChevronLeft, Home } from 'lucide-react'
import { AppLink } from '@/_components/global/app-link'

/**
 * Unauthorized Page
 *
 * This page is displayed when a user attempts to access a resource
 * they don't have permission to view.
 */
export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
          <p className="text-red-100 text-sm">You don&apos;t have permission to access this page</p>
        </div>

        <div className="p-8">
          <div className="mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-50 rounded-full">
                <ShieldAlert className="h-16 w-16 text-red-500" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Unauthorized Access</h2>
            <p className="text-gray-600 mb-8">
              You don&apos;t have the necessary permissions to view this page.
              Please contact an administrator if you believe this is an error.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="py-2.5 px-5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2 font-medium"
              >
                <ChevronLeft className="h-4 w-4" />
                Go Back
              </button>
              <AppLink
                href="/"
                className="py-2.5 px-5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2 font-medium"
              >
                <Home className="h-4 w-4" />
                Return to Home
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
