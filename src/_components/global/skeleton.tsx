import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Skeleton Component
 *
 * A reusable skeleton loader component based on shadcn/ui skeleton.
 * Uses a subtle pulse animation to indicate loading states.
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The component props
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        className
      )}
      {...props}
    />
  )
}
