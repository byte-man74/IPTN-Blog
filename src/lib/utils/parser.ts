/**
 * Utility functions for parsing and cleaning data
 */

/**
 * Cleans an email address by trimming whitespace and converting to lowercase
 * @param email The email address to clean
 * @returns The cleaned email address
 */
export function cleanEmail(email: string): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}
