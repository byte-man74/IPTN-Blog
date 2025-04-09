'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { FaLock, FaUser } from 'react-icons/fa'
import { useForm } from 'react-hook-form'

/**
 * Admin Login Page
 *
 * This page provides a secure login interface for admin users.
 * It includes form validation and authentication handling.
 */
export default function AdminLogin() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        setFormError('root', {
          type: 'manual',
          message: 'Invalid email or password'
        })
      } else {
        router.push('/admin')
      }
    } catch (err) {
      setFormError('root', {
        type: 'manual',
        message: 'An error occurred during login'
      })
      console.error(err)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-white shadow-xl overflow-hidden">
        <div className="bg-primaryGreen p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-green-100 mt-1">Sign in to access your admin panel</p>
        </div>

        <div className="p-6">
          {errors.root && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <FaUser />
                </div>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="admin@example.com"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <FaLock />
                </div>
                <input
                  id="password"
                  type="password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 bg-primaryGreen hover:bg-black/90 text-white font-bold transition duration-200 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Forgot your password? Contact the system administrator.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
