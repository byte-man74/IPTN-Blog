import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { type DefaultSession } from 'next-auth'
import { prisma } from './lib/third-party/prisma'

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user']
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        return {
          id: profile?.id,
          firstName: profile?.given_name ?? "",
          lastName: profile?.family_name ?? "",
          email: profile?.email,
          image: profile?.picture,
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user?.id,
          isAdmin: user?.isAdmin ?? false,
          isActive: user?.isActive ?? false,
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          picture: user?.image,
        },
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
})
