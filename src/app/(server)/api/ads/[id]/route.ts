import { NextRequest, NextResponse } from 'next/server'
import { AdsService } from '@/app/(server)/modules/ads/ads.service'
import { EditAdSchema } from '@/app/(server)/modules/ads/ads.types'
import ApiCustomError from '@/types/api-custom-error'
import { logger } from '@/lib/utils/logger'

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolved_params = await params
    const adId = await resolved_params.id;

    if (!adId) {
      return NextResponse.json({ error: 'Missing ad ID parameter' }, { status: 400 });
    }
    const adService = new AdsService();
    const ad = await adService.fetchAdDetail(adId);

    if (ad instanceof ApiCustomError) {
      return NextResponse.json({ error: ad.message }, { status: ad.status });
    }

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    return NextResponse.json(ad, { status: 200 });
  } catch (error) {
    logger.error(`Failed to fetch ad: ${error}`);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { }: RouteParams) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate request body using the EditAdSchema
    const validationResult = EditAdSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const adData = validationResult.data
    const adService = new AdsService()

    // Call the service to update the ad
    const updatedAd = await adService.modifyAd(adData)

    // If an error is returned from the service (ApiCustomError)
    if (updatedAd instanceof ApiCustomError) {
      return NextResponse.json({ error: updatedAd.message }, { status: updatedAd.status })
    }

    // Return the updated ad data
    return NextResponse.json(updatedAd, { status: 200 })
  } catch (error) {
    logger.error(`failed to edit an ad ${error}`)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Extract adId from query parameters
    const resolved_params = await params
    const adId = await resolved_params.id;

    if (!adId) {
      return NextResponse.json({ error: 'Missing ad ID parameter' }, { status: 400 });
    }

    const adService = new AdsService()
    const result = await adService.deleteAd(adId)

    // If an error is returned from the service (ApiCustomError)
    if (result instanceof ApiCustomError) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    return NextResponse.json({ message: 'Ad deleted successfully' }, { status: 200 })
  } catch (error) {
    logger.error(`failed to delete an ad ${error}`)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
