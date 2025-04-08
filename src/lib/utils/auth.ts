import { compare, hash } from 'bcrypt';

/**
 * Hashes a password using bcrypt
 * @param password The plain text password to hash
 * @returns Promise with the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  // Hash the password (using 10 salt rounds)
  return await hash(password, 10);
}

/**
 * Validates a password against a hash
 * @param password The plain text password to validate
 * @param hashedPassword The hashed password to compare against
 * @returns Promise with boolean indicating if validation passed
 */
export async function validatePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}
