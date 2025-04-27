import { NextRequest, NextResponse } from 'next/server'
import { PollService } from '@/app/(server)/modules/polls/poll.service'
import ApiCustomError from '@/types/api-custom-error'
import { logger } from '@/lib/utils/logger'

type RouteParams = {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/polls/[id]/winner - Get the winner of a specific poll
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolved_params = await params
    const pollId = parseInt(resolved_params.id)

    if (isNaN(pollId)) {
      return NextResponse.json({ error: 'Invalid poll ID' }, { status: 400 })
    }

    const pollService = new PollService()
    const result = await pollService.findPollWinner(pollId)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Poll winner not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error(`Error finding poll winner: ${error}`)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
