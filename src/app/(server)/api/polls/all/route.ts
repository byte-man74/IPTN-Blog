import { NextRequest, NextResponse } from 'next/server'
import { PollService } from '@/app/(server)/modules/polls/poll.service'
import ApiCustomError from '@/types/api-custom-error'
import { auth } from '@/auth'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/polls/all - Fetch all polls for admin
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    // Ensure only admins can access this endpoint
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
    }

    const pollService = new PollService()
    const polls = await pollService.fetchAllPolls()

    if (polls instanceof ApiCustomError) {
      return NextResponse.json({ error: polls.message }, { status: polls.status })
    }

    return NextResponse.json(polls || [])
  } catch (error) {
    logger.error('Error fetching all polls:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
