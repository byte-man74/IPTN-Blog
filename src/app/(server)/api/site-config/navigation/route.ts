import { NextRequest, NextResponse } from 'next/server'
import { SiteConfigService } from '@/app/(server)/modules/site-configurations/site-config.service'
import { SiteConfigNavDTO } from '@/app/(server)/modules/site-configurations/site-config.types'
import { logger } from '@/lib/utils/logger'

export async function PATCH(request: NextRequest) {
  try {
    const siteConfigService = new SiteConfigService()
    const config: SiteConfigNavDTO = await request.json()

    const result = await siteConfigService.updateNavigation(config)

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update navigation configuration' },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error updating navigation configuration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
