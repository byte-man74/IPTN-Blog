import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/app/(server)/modules/analytics/analytics.service'
import ApiCustomError from '@/types/api-custom-error'
import { checkAuth } from '@/lib/utils/protected-route'
import { logger } from '@/lib/utils/logger'

// GET /api/analytics/summary - Get analytics summary
export async function GET(request: NextRequest) {
  return checkAuth(request, async () => {
    try {
      // Get analytics summary
      const analyticsService = new AnalyticsService()
      const result = await analyticsService.getAnalyticsSummary()

      if (result instanceof ApiCustomError) {
        return NextResponse.json({ error: result.message }, { status: result.status })
      }

      if (!result) {
        return NextResponse.json({ error: 'Failed to retrieve analytics summary' }, { status: 500 })
      }

      return NextResponse.json(result)
    } catch (error) {
      logger.error('Error fetching analytics summary:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  })
}
