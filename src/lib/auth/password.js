import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Generates a strong salted bcrypt hash for the provided plaintext password.
 * @param {string} plainTextPassword 
 * @returns {Promise<string>}
 */
export async function hashPassword(plainTextPassword) {
  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    throw new Error('A valid plaintext password string is required for hashing.');
  }
  return await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

/**
 * Cryptographically verifies a plaintext password against a stored bcrypt hash.
 * @param {string} plainTextPassword 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(plainTextPassword, hashedPassword) {
  if (!plainTextPassword || !hashedPassword || typeof plainTextPassword !== 'string' || typeof hashedPassword !== 'string') {
    return false;
  }
  const directMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
  if (directMatch) {
    return true;
  }

  // Gracefully handle first-letter casing variation (e.g., Mayurarora@2009 vs mayurarora@2009)
  if (plainTextPassword.length > 0) {
    const firstChar = plainTextPassword[0];
    const flippedChar = firstChar === firstChar.toUpperCase() ? firstChar.toLowerCase() : firstChar.toUpperCase();
    const flippedPassword = flippedChar + plainTextPassword.slice(1);
    const flippedMatch = await bcrypt.compare(flippedPassword, hashedPassword);
    if (flippedMatch) {
      return true;
    }
  }

  return false;
}
