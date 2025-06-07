import { generateOgImage, generateTwitterImage } from './seo.utils/image-generator'
import ApiCustomError from '@/types/api-custom-error'
import { SeoDTO } from './seo.types'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import { uploadFileToCloudinary } from '@/lib/third-party/cloudinary'
import { SeoRepository } from './seo.repository'

export interface ISeoService {
  generateOpenGraphImage(
    title: string,
    image?: string | null
  ): Promise<string | null | ApiCustomError>
  generateTwitterImage(
    title: string,
    image?: string | null
  ): Promise<string | null | ApiCustomError>
  generateSeoImages(
    title: string,
    coverImage?: string | null
  ): Promise<SeoDTO | null | ApiCustomError>
  createOrUpdateSeo(newsId: string, seoData: SeoDTO): Promise<SeoDTO | null | ApiCustomError>
}

export class SeoService implements ISeoService {
  private readonly repository: SeoRepository

  constructor() {
    this.repository = new SeoRepository()
  }

  private async uploadImageToCloudinary(imageResponse: Response): Promise<string | null> {
    try {
      const buffer = await imageResponse?.arrayBuffer()
      if (!buffer) return null

      const base64Image = Buffer.from(buffer).toString('base64')
      const dataURI = `data:image/png;base64,${base64Image}`
      const result = await uploadFileToCloudinary(dataURI, 'og-images')
      return result?.url ?? null
    } catch {
      return null
    }
  }

  /**
   * Generates an Open Graph image for social media sharing
   * @param title - The title to display on the image
   * @param image - Optional image URL to use as background
   * @returns A URL string to the generated image
   */
  async generateOpenGraphImage(
    title: string,
    image?: string | null
  ): Promise<string | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      const response = await generateOgImage({
        title,
        image,
      })

      if (!response) return null

      // Create a new Response object from the buffer
      const responseObj = new Response(response)
      // Upload the generated image to Cloudinary
      const uploadResult = await this.uploadImageToCloudinary(responseObj)
      return uploadResult
    })
  }

  /**
   * Generates a Twitter image for social media sharing
   * @param title - The title to display on the image
   * @param image - Optional image URL to use as background
   * @returns A URL string to the generated image
   */
  async generateTwitterImage(
    title: string,
    image?: string | null
  ): Promise<string | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      const response = await generateTwitterImage({
        title,
        image,
      })

      if (!response) return null

      // Upload the generated image to Cloudinary
      const responseObj = new Response(response)
      const uploadResult = await this.uploadImageToCloudinary(responseObj)

      return uploadResult
    })
  }

  /**
   * Generates both OpenGraph and Twitter images in one operation
   * @param title - The title to display on the image
   * @param coverImage - Optional image URL to use as background
   * @returns Object containing URLs for both image types
   */
  async generateSeoImages(
    title: string,
    coverImage?: string | null
  ): Promise<SeoDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      // Generate both images
      const openGraphImage = await this.generateOpenGraphImage(title, coverImage)
      const twitterImage = await this.generateTwitterImage(title, coverImage)

      // Check for errors
      if (openGraphImage instanceof ApiCustomError) throw openGraphImage
      if (twitterImage instanceof ApiCustomError) throw twitterImage

      return {
        openGraphImage,
        twitterImage,
      }
    })
  }

  /**
   * Creates or updates SEO data for a news article
   * @param newsId - The ID of the news article
   * @param seoData - The SEO data to save
   * @returns The created or updated SEO record
   */
  async createOrUpdateSeo(
    newsId: string,
    seoData: SeoDTO
  ): Promise<SeoDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.repository.createOrUpdateSeo(newsId, seoData)
    })
  }
}
