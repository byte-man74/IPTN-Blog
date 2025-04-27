/**
 * Formats a date object into a readable string format
 * @param date - The date to format
 * @param options - Date formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | null,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  if (!date) return 'N/A'

  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('en-US', options).format(dateObj)
}
