import ApiCustomError from '@/types/api-custom-error'
import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export async function deleteFileFromCloudinary(publicId: string) {
  try {
    return await cloudinary.v2.api.delete_resources([publicId])
  } catch (error) {
    return new ApiCustomError('Unable to delete file', 500, {
      error,
    })
  }
}

export async function uploadFileToCloudinary(file: string, folder?: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadOptions: any = {}
    if (folder) {
      uploadOptions.folder = folder
    }

    const result = await cloudinary.v2.uploader.upload(file, uploadOptions)

    if (!result?.secure_url || !result?.public_id) {
      throw new ApiCustomError('Failed to upload file to Cloudinary', 500)
    }

    return {
      url: result.secure_url,
      thumbnailUrl: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    throw new ApiCustomError('Failed to upload file to Cloudinary', 500, {
      originalError: error,
    })
  }
}

export async function resizeImageToOpenGraphDimension(publicId?: string | null) {
  if (!publicId) {
    return ''
  }

  const transformationOptions = {
    width: 1200,
    height: 630,
    crop: 'fill',
  }

  return cloudinary.v2.url(publicId, transformationOptions)
}

export function convertCloudinaryPublicIdToUrl(publicId: string): string {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`
}

export async function generateFavicon(publicId?: string | null) {
  if (!publicId) {
    return null
  }
  const faviconUrl = cloudinary.v2.url(publicId, {
    transformation: [{ width: 32, height: 32, crop: 'fill' }],
    format: 'ico',
  })

  return faviconUrl
}
