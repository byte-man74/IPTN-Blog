import React from 'react'
import Link from 'next/link'
import { IconType } from 'react-icons'

/**
 * Interface for AppLink component props
 */
interface AppLinkProps {
  /** URL the link points to */
  href: string
  /** Content to be rendered inside the link */
  children: React.ReactNode
  /** Optional CSS class names */
  className?: string
  /** Optional target attribute for the link */
  target?: string
  /** Optional rel attribute for the link */
  rel?: string
  /** Optional aria-label for accessibility */
  ariaLabel?: string
  /** Optional icon to display before the link text */
  icon?: IconType
  /** Optional size for the icon (defaults to 20) */
  iconSize?: number
  /** Optional onClick handler for the link */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

/**
 * AppLink component
 *
 * A reusable link component that wraps Next.js Link with additional features:
 * - Automatically handles external links (adds target="_blank" and rel="noopener noreferrer")
 * - Supports icons from react-icons
 * - Includes accessibility attributes
 * - Applies consistent transition styling
 * - Supports custom click handlers
 *
 * @param {AppLinkProps} props - The component props
 * @returns {JSX.Element} Rendered link component
 */
export const AppLink = ({
  href,
  children,
  className = '',
  target,
  rel,
  ariaLabel,
  icon: Icon,
  iconSize = 20,
  onClick,
}: AppLinkProps) => {
  // Trim href if it's a string
  const trimmedHref = typeof href === 'string' ? href.trim() : href
  const isExternal = trimmedHref?.startsWith('http') || trimmedHref?.startsWith('mailto:')
  const linkProps = isExternal
    ? {
        target: target || '_blank',
        rel: rel || 'noopener noreferrer',
      }
    : {}

  return (
    <Link
      href={!trimmedHref || trimmedHref === "" ? '#' : trimmedHref}
      className={`transition-colors ${className}`}
      aria-label={ariaLabel}
      onClick={onClick}
      {...linkProps}
    >
      {Icon && <Icon size={iconSize} className="inline-block mr-2" />}
      {children}
    </Link>
  )
}
