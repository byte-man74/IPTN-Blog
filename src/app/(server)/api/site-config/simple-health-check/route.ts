import { NextRequest, NextResponse } from 'next/server'
import { SiteConfigService } from '@/app/(server)/modules/site-configurations/site-config.service'
import { logger } from '@/lib/utils/logger'
import { checkAuth } from '@/lib/utils/protected-route'

// GET /api/site-config/simple-health-check - Perform a quick content health check
export async function GET(request: NextRequest) {
  return checkAuth(request, async () => {
    try {
      const siteConfigService = new SiteConfigService()
      const result = await siteConfigService.performSimpleHealthCheck()

      if (!result) {
        return NextResponse.json(
          { error: 'Failed to perform simple health check' },
          { status: 500 }
        )
      }

      return NextResponse.json(result)
    } catch (error) {
      logger.error('Error performing simple health check:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  })
}
