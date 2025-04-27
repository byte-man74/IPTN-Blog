import { NextRequest, NextResponse } from 'next/server'
import { PollService } from '@/app/(server)/modules/polls/poll.service'
import ApiCustomError from '@/types/api-custom-error'
import { auth } from '@/auth'
import { z } from 'zod'
import { logger } from '@/lib/utils/logger'

type RouteParams = {
  params: Promise<{
    id: string
  }>
}

// Schema for vote payload
const VoteSchema = z.object({
  optionId: z.number(),
})

/**
 * POST /api/polls/[id]/vote - Vote on a poll
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required to vote on polls' },
        { status: 401 }
      )
    }

    const resolved_params = await params
    const pollId = parseInt(resolved_params.id)

    if (isNaN(pollId)) {
      return NextResponse.json({ error: 'Invalid poll ID' }, { status: 400 })
    }

    const body = await request.json()

    // Validate vote data
    const validationResult = VoteSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid vote data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const { optionId } = validationResult.data
    const userId = session.user.id

    const pollService = new PollService()
    const result = await pollService.voteOnPoll(pollId, optionId, userId)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error(`Error voting on poll: ${error}`)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/polls/[id]/vote - Remove a vote from a poll
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required to remove votes' },
        { status: 401 }
      )
    }

    const resolved_params = await params
    const pollId = parseInt(resolved_params.id)

    if (isNaN(pollId)) {
      return NextResponse.json({ error: 'Invalid poll ID' }, { status: 400 })
    }

    const userId = session.user.id

    const pollService = new PollService()
    const result = await pollService.removeVote(pollId, userId)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error(`Error removing vote from poll: ${error}`)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
