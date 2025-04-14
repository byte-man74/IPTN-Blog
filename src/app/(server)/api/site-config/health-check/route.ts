import { NextRequest, NextResponse } from 'next/server'
import { SiteConfigService } from '@/app/(server)/modules/site-configurations/site-config.service'
import { logger } from '@/lib/utils/logger'
import { checkAuth } from '@/lib/utils/protected-route'

// POST /api/site-config/health-check - Perform a complete content health check
export async function POST(request: NextRequest) {
  return checkAuth(request, async () => {
    try {
      const siteConfigService = new SiteConfigService()
      const result = await siteConfigService.checkSiteContentHealth()

      if (!result) {
        return NextResponse.json({ error: 'Failed to check site content health' }, { status: 500 })
      }

      return NextResponse.json(result)
    } catch (error) {
      logger.error('Error checking site content health:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  })
}
