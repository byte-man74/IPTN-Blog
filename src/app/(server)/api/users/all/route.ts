import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/app/(server)/modules/user/user.service'
import { checkAuth } from '@/lib/utils/protected-route'
import { logger } from '@/lib/utils/logger'

export async function GET(request: NextRequest) {
  return checkAuth(request, async () => {
    try {
      const userService = new UserService()
      const users = await userService.fetchUsers()

      if (!users) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
      }

      return NextResponse.json(users)
    } catch (error) {
      logger.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  })
}
