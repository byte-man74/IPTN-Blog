import { NextRequest, NextResponse } from 'next/server'
import { SiteConfigService } from '@/app/(server)/modules/site-configurations/site-config.service'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  try {
    const siteConfigService = new SiteConfigService()
    const result = await siteConfigService.initializeSiteConfig()

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to initialize site configuration' },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error initializing site configuration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
