import React from 'react'


/**
 * NavigationItemSkeleton
 *
 * A skeleton loader for navigation items.
 * Used in headers and navigation bars.
 */
export const NavigationItemSkeleton = () => (
  <div className="h-6 w-20 bg-gray-700 animate-pulse rounded"></div>
)

/**
 * TableRowSkeleton
 *
 * A skeleton loader for a table row.
 * Used in tables and list views.
 */
export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr>
    {Array(columns)
      .fill(0)
      .map((_, index) => (
        <td key={index} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
  </tr>
)

/**
 * TableHeaderSkeleton
 *
 * A skeleton loader for table headers.
 * Used in tables and list views.
 */
export const TableHeaderSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr>
    {Array(columns)
      .fill(0)
      .map((_, index) => (
        <th key={index} scope="col" className="px-6 py-3 text-left">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </th>
      ))}
  </tr>
)

/**
 * CardSkeleton
 *
 * A skeleton loader for card components.
 * Used for content cards, profile cards, etc.
 */
export const CardSkeleton = ({ height = 'h-40' }: { height?: string }) => (
  <div className={`${height} w-full bg-gray-200 animate-pulse rounded-md`}></div>
)
