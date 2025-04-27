import { NextRequest, NextResponse } from 'next/server'
import { PollService } from '@/app/(server)/modules/polls/poll.service'
import { CreatePollSchema } from '@/app/(server)/modules/polls/poll.types'
import ApiCustomError from '@/types/api-custom-error'
import { auth } from '@/auth'
import { logger } from '@/lib/utils/logger'

type RouteParams = {
  params: Promise<{
    id: string
  }>
}

/**
 * PUT /api/polls/[id] - Modify an existing poll
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    // Check if user is authenticated and has permission to modify polls
    if (!session?.user?.isAdmin && !session?.user?.isActive) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not have permission to modify polls' },
        { status: 401 }
      )
    }

    const resolved_params = await params
    const pollId = parseInt(resolved_params.id)

    if (isNaN(pollId)) {
      return NextResponse.json({ error: 'Invalid poll ID' }, { status: 400 })
    }

    const body = await request.json()

    // Validate poll data (assuming CreatePollSchema exists)
    const validationResult = CreatePollSchema.partial().safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid poll data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const pollService = new PollService()
    const result = await pollService.modifyPoll(pollId, validationResult.data)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error(`Error modifying poll: ${error}`)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/polls/[id] - Delete a poll
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    // Check if user is authenticated and has permission to delete polls
    if (!session?.user?.isAdmin && !session?.user?.isActive) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not have permission to delete polls' },
        { status: 401 }
      )
    }

    const resolved_params = await params
    const pollId = parseInt(resolved_params.id)

    if (isNaN(pollId)) {
      return NextResponse.json({ error: 'Invalid poll ID' }, { status: 400 })
    }

    const pollService = new PollService()
    const result = await pollService.deletePoll(pollId)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    return NextResponse.json({ message: 'Poll deleted successfully' }, { status: 200 })
  } catch (error) {
    logger.error(`Error deleting poll: ${error}`)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
