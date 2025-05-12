import React from 'react'
import { AppImage } from '@/_components/global/app-image'
import { AppLink } from '@/_components/global/app-link'

/**
 * Interface for AppLogo component props
 */
interface AppLogoProps {
  /** Alternative text for the logo */
  alt?: string
  /** Optional width of the logo */
  width?: number
  /** Optional height of the logo */
  height?: number
  /** Optional CSS class names */
  className?: string
  /** Optional link URL */
  href?: string
  /** Optional link target */
  target?: string
}

/**
 * AppLogo component
 *
 * A reusable logo component that can be used across the application
 * - Displays the logo image with proper alt text
 * - Can be wrapped in a link if href is provided
 * - Supports customizable dimensions and styling
 * - Supports dark (default) and white variants of the logo
 *
 * @param {AppLogoProps} props - The component props
 * @returns {JSX.Element} Rendered logo component
 */
export const AppLogoBlack = ({
  alt = 'Company Logo',
  width = 100,
  height = 50,
  className = 'z-10',
  href,
  target,
}: AppLogoProps) => {
  // Determine which logo variant to use
  const logoSrc = '/assets/Iptn-blk.png'

  const logoImage = (
    <AppImage
      src={logoSrc}
      alt={alt ?? 'Company Logo'}
      width={width}
      height={height}
      className={className}
      priority={true}
      objectFit="contain"
    />
  )
  return (
    <AppLink href={href ?? '/'} target={target} className="inline-block">
      {logoImage}
    </AppLink>
  )
}
