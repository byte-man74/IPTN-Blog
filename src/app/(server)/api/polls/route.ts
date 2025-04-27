import { NextRequest, NextResponse } from 'next/server'
import { PollService } from '@/app/(server)/modules/polls/poll.service'
import { CreatePollSchema } from '@/app/(server)/modules/polls/poll.types'
import ApiCustomError from '@/types/api-custom-error'
import { auth } from '@/auth'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/polls - Fetch all active polls with votes
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    const pollService = new PollService()
    const polls = await pollService.fetchActivePollsWithVotes(userId)

    if (polls instanceof ApiCustomError) {
      return NextResponse.json({ error: polls.message }, { status: polls.status })
    }

    return NextResponse.json(polls || [])
  } catch (error) {
    logger.error('Error fetching polls:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/polls - Create a new poll
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    // Check if user is authenticated and has permission to create polls
    if (!session?.user?.isAdmin && !session?.user?.isActive) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not have permission to create polls' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Convert string dates to Date objects
    if (body?.startDate) {
      body.startDate = new Date(body.startDate)
    }

    if (body?.endDate) {
      body.endDate = new Date(body.endDate)
    }
    const validationResult = CreatePollSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid poll data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const pollService = new PollService()
    const result = await pollService.createPoll(validationResult.data)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    logger.error('Error creating poll:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
