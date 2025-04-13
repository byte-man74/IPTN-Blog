import { NextRequest, NextResponse } from 'next/server'

import { logger } from '@/lib/utils/logger'
import { AnalyticsService } from '@/app/(server)/modules/analytics/analytics.service'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const analyticsService = new AnalyticsService()


    const popularNews = await analyticsService.getAnalyticsPopularNews()

    if (!popularNews) {
      return NextResponse.json({ error: 'Failed to fetch popular news' }, { status: 500 })
    }

    return NextResponse.json(popularNews)
  } catch (error) {
    logger.error('Error fetching popular news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
