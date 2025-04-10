import slugify from 'slugify';

/**
 * Converts a string to a URL-friendly slug
 * @param content The string to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugifyContent(content: string): string {
  if (!content) {
    return '';
  }

  return slugify(content, {
    lower: true,      // Convert to lowercase
    strict: true,     // Strip special characters
    trim: true,       // Trim leading and trailing spaces
    replacement: '-', // Replace spaces with hyphens
  });
}


export function getNewsSummary(content: string, maxLength: number = 150): string {
  if (!content) {
    return '';
  }

  // Remove HTML tags if present
  const textContent = content.replace(/<[^>]*>/g, '');

  // Trim and limit to maxLength
  if (textContent.length <= maxLength) {
    return textContent.trim();
  }

  // Find the last space before maxLength to avoid cutting words
  const lastSpace = textContent.substring(0, maxLength).lastIndexOf(' ');
  const cutPoint = lastSpace > 0 ? lastSpace : maxLength;

  return textContent.substring(0, cutPoint).trim() + '...';
}
