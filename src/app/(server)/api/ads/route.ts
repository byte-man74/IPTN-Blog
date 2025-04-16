import { NextRequest, NextResponse } from 'next/server'
import { AdsService } from '@/app/(server)/modules/ads/ads.service'
import ApiCustomError from '@/types/api-custom-error'
import { isValidJson } from '@/lib/utils/validator'
import { CreateAdSchema } from '@/app/(server)/modules/ads/ads.types'
import { logger } from '@/lib/utils/logger'

// GET /api/ads?pageType=HOME - Fetch ad by page type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageType = searchParams.get('pageType')

    if (!pageType) {
      return NextResponse.json({ error: 'Missing pageType query parameter' }, { status: 400 })
    }

    const adService = new AdsService()
    const result = await adService.getAdForPageType(pageType)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    if (!result) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error(`failed to retrieve ad ${error}`)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/ads - Create an ad
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!isValidJson(body)) {
      return NextResponse.json(
        { error: 'Invalid request format: Expected JSON object' },
        { status: 400 }
      )
    }

    const validationResult = CreateAdSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const adService = new AdsService()
    const result = await adService.createAd(validationResult.data)

    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    logger.error(`failed to create an ad ${error}`)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
