import React from 'react'
import Image from 'next/image'

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
}

/**
 * Global image component with SEO enhancements
 *
 * A reusable image component that wraps Next.js Image with additional features:
 * - Proper alt text for accessibility and SEO
 * - Optimized loading with optional priority
 * - Flexible styling options
 * - Configurable opacity
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
}: AppImageProps) => {
  return (
    <Image
      src={src ?? '/placeholder.jpg'}
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
    />
  )
}
