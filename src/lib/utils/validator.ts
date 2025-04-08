/**
 * Utility functions for validating data
 */

/**
 * Validates if a string is a valid email address
 * @param email The email address to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a password meets minimum requirements
 * @param password The password to validate
 * @param minLength Minimum length requirement (default: 8)
 * @returns Boolean indicating if the password is valid
 */
export function isValidPassword(password: string, minLength = 8): boolean {
  if (!password || password.length < minLength) return false;

  // Check for at least one uppercase letter
  const hasUppercase = /[A-Z]/.test(password);

  // Check for at least one lowercase letter
  const hasLowercase = /[a-z]/.test(password);

  // Check for at least one number
  const hasNumber = /\d/.test(password);

  // Check for at least one special character
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

/**
 * Validates if a string is not empty after trimming
 * @param value The string to validate
 * @returns Boolean indicating if the string is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value !== undefined && value !== null && value.trim() !== '';
}

/**
 * Validates if a value is within a specified range
 * @param value The number to validate
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 * @returns Boolean indicating if the value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}


/**
 * Validates if a value is a valid JSON object
 * @param value The value to validate
 * @returns Boolean indicating if the value is a valid JSON object
 */
export function isValidJson(value: unknown): boolean {
  if (value === null || value === undefined) return false;

  try {
    // If value is already an object (not a string), check if it's a plain object
    if (typeof value === 'object') {
      return value !== null && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
    }

    // If value is a string, try to parse it
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
    }

    return false;
  } catch {
    return false;
  }
}
