
import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/app/(server)/modules/user/user.service'
import { checkAuth } from '@/lib/utils/protected-route'
import { logger } from '@/lib/utils/logger'

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return checkAuth(request, async () => {
    try {
      const userService = new UserService()
      const userData = await request.json()

      // Add the ID from the URL params to the user data
      const userToUpdate = {
        ...userData,
        id: params.id,
      }

      const result = await userService.updateUserInformation(userToUpdate)

      if (!result) {
        return NextResponse.json({ error: 'Failed to update user information' }, { status: 500 })
      }

      return NextResponse.json(result)
    } catch (error) {
      logger.error('Error updating user information:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  })
}
