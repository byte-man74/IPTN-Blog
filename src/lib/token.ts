import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'

import { API_URL } from '@/environment-config'

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${API_URL}/user/authorize`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { 'Content-Type': 'application/json' },
          })

          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData?.error || `Request failed with status ${res.status}`)
          }

          const contentType = res.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response format from server')
          }

          const data = await res.json()

          if (!data) {
            throw new Error('No data received from server')
          }

          return {
            id: data?.user_id?.toString() ?? '',
            email: data?.email ?? '',
            firstName: data?.first_name ?? null,
            lastName: data?.last_name ?? null,
            isAdmin: data?.is_admin ?? false,
            isActive: data?.is_active ?? true,
          }
        } catch (error: Error | unknown) {
          console.error('Error in authorize function:', error)
          if (error instanceof Error && error.message?.includes('401')) {
            throw new Error('Invalid email or password')
          }
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
          throw new Error(errorMessage)
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string,
          firstName: token.firstName as string | null,
          lastName: token.lastName as string | null,
          isAdmin: token.isAdmin as boolean,
          isActive: token.isActive as boolean,
        },
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.isAdmin = user.isAdmin
        token.isActive = user.isActive
      }
      return token
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  debug: process.env.NODE_ENV === 'development',
})
