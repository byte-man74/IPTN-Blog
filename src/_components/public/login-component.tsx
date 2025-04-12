'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

/**
 * Login Page
 *
 * This page provides a secure login interface for users.
 * It includes Google OAuth authentication.
 */
export const LoginComponent = () => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    setError: setFormError,
    formState: { errors },
  } = useForm()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/admin' })
    } catch (error) {

      console.error('Google sign in error:', error)
      setFormError('root', {
        type: 'manual',
        message: 'An error occurred with Google sign in',
      })
      toast.error('An error occurred with Google sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-green-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">Admin Portal</h1>
          <p className="text-green-100 text-sm">Secure access to your content management system</p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Welcome Back</h2>

          {errors.root && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.root.message}
              </p>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Sign in with Google
              </>
            )}
          </button>


          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Need help? <a href="#" className="text-green-600 font-medium hover:underline">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
