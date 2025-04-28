import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'
import { AnalyticsService } from '@/app/(server)/modules/analytics/analytics.service'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const analyticsService = new AnalyticsService()
    const result = await analyticsService.saveUserMixpanelIdentity(userId)

    if (typeof result !== 'boolean') {
      return NextResponse.json({ error: 'Failed to save mixpanel identity' }, { status: 500 })
    }

    return NextResponse.json({ success: result })
  } catch (error) {
    logger.error('Error saving mixpanel identity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
