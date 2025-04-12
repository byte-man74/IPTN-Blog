'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

/**
 * Interface for AppImage component props
 */
interface AppImageProps {
  /** Source URL of the image */
  src: string
  /** Alternative text for the image */
  alt: string
  /** Optional width of the image */
  width?: number
  /** Optional height of the image */
  height?: number
  /** Optional CSS class names */
  className?: string
  /** Optional priority loading flag */
  priority?: boolean
  /** Optional object-fit style */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  /** Optional object-position style */
  objectPosition?: string
  /** Optional opacity value (0-1) */
  opacity?: number
  /** Optional placeholder image to show on error */
  fallbackSrc?: string
  /** Optional flag to use Cloudinary image component */
  optimizeImage?: boolean
}

/**
 * Global image component with SEO enhancements
 *
 * A reusable image component that wraps Next.js Image with additional features:
 * - Proper alt text for accessibility and SEO
 * - Optimized loading with optional priority
 * - Flexible styling options
 * - Configurable opacity
 * - Error handling with fallback to placeholder grid
 * - Optional Cloudinary image optimization
 *
 * @param {AppImageProps} props - The component props
 * @returns {JSX.Element} Rendered image component
 */
export const AppImage = ({
  src,
  alt,
  className = '',
  width = 1000,
  height = 1000,
  priority = true,
  objectFit = 'cover',
  objectPosition = 'center',
  opacity = 1,
  fallbackSrc = '',
  optimizeImage = false,
}: AppImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc)
  const [hasError, setHasError] = useState<boolean>(false)

  const handleError = () => {
    if (fallbackSrc) {
      setImgSrc(fallbackSrc)
    } else {
      setHasError(true)
    }
  }

  if (hasError) {
    return (
      <div
        className={`grid relative z-1 ${className || ''}`}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0',
          placeItems: 'center'
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <ImageOff size={32} />
          <span>{alt || 'Image'}</span>
        </div>
      </div>
    )
  }

  if (optimizeImage) {
    return (
      <CldImage
        src={imgSrc}
        alt={alt ?? ''}
        width={width}
        height={height}
        priority={priority}
        style={{
          objectFit,
          objectPosition,
          opacity,
        }}
        className={className || ''}
        onError={handleError}
      />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt ?? ''}
      width={width}
      height={height}
      priority={priority}
      style={{
        objectFit,
        objectPosition,
        opacity,
      }}
      className={className || ''}
      onError={handleError}
    />
  )
}
