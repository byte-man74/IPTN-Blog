import { NextRequest, NextResponse } from 'next/server'
import { SiteConfigService } from '@/app/(server)/modules/site-configurations/site-config.service'
import { logger } from '@/lib/utils/logger'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const siteConfigRepository = new SiteConfigService()
    const siteConfig = await siteConfigRepository.getSiteConfig()

    return NextResponse.json(siteConfig)
  } catch (error) {
    logger.error('Error retrieving site configuration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
