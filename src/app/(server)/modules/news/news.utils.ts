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


export const calculateTimeStampFromDate = (date: string | Date) => {
  const now = new Date();
  const dateObj = date instanceof Date ? date : new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const diffInMilliseconds = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else {
    // Format date as MM/DD/YYYY
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
export const cleanUpNewsTitle = (title: string, maxLength: number = 70): string => {
  if (!title) return '';

  // Remove HTML tags if present
  let cleanTitle = title.replace(/<[^>]*>/g, '');

  // Replace curly apostrophes (&#8217;s) with straight apostrophes
  cleanTitle = cleanTitle.replace(/&#8217;s/g, "'s");
  cleanTitle = cleanTitle.replace(/\u2019s/g, "'s");

  // Replace multiple spaces with a single space
  cleanTitle = cleanTitle.replace(/\s+/g, ' ');

  // Trim whitespace from beginning and end
  cleanTitle = cleanTitle.trim();

  // Remove special characters that might cause issues
  cleanTitle = cleanTitle.replace(/[^\w\s.,!?'\-]/g, '');

  // Truncate title if it exceeds maxLength
  if (cleanTitle.length <= maxLength) {
    return cleanTitle;
  }

  // Find the last space before maxLength to avoid cutting words
  const lastSpace = cleanTitle.substring(0, maxLength).lastIndexOf(' ');
  const cutPoint = lastSpace > 0 ? lastSpace : maxLength;

  return cleanTitle.substring(0, cutPoint).trim() + '...';
}
