// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'
declare module 'next-auth' {
  interface Session {
    user: User
  }

  interface User {
    id?: string
    email?: string | null
    firstName?: string | null
    lastName?: string | null
    isAdmin?: boolean
    isActive?: boolean
  }

  interface JWT {
    firstName?: string | null
    lastName?: string | null
    isAdmin?: boolean
    isActive?: boolean
  }
}
