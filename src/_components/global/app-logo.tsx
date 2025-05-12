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
  /** Optional variant of the logo (dark or white) */
  variant?: 'dark' | 'white'
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
export const AppLogo = ({
  alt = 'Company Logo',
  width = 150,
  height = 50,
  className = 'z-10',
  href,
  target,
  variant = 'dark',
}: AppLogoProps) => {
  // Determine which logo variant to use
  const logoSrc = variant === 'white'
    ? "/assets/iptn-black.png"
    : "/assets/iptn-logo.svg"

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
