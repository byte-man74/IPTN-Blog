/**
 * Calculates the estimated reading duration for a news article
 * @param news - The news article data
 * @returns Estimated reading duration as a string (e.g. "3 min")
 */
export function generateNewsReadingDurationFromNews(contentEncoded: string): string {
  // Average reading speed (words per minute)
  const wordsPerMinute = 200

  // Extract content from the news
  const content = contentEncoded || ''

  // Count words (split by spaces and filter out empty strings)
  const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length

  // Calculate reading time in minutes
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute))

  // Return formatted reading time
  return `${readingTimeMinutes} min`
}
