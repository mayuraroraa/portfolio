// Lightweight sliding-window rate limiter in memory (with automatic eviction)
const rateLimitMap = new Map();

/**
 * Check if an IP has exceeded limit within windowMs
 * @param {string} key Identifier (e.g. IP + endpoint)
 * @param {number} limit Max allowed requests
 * @param {number} windowMs Time window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetMs: number }}
 */
export function checkRateLimit(key, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitMap.get(key) || [];
  
  // Filter out timestamps older than windowMs
  const validTimestamps = record.filter(time => now - time < windowMs);
  
  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0];
    const resetMs = windowMs - (now - oldest);
    return {
      allowed: false,
      remaining: 0,
      resetMs
    };
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(key, validTimestamps);
  
  // Clean up old map entries every 500 keys
  if (rateLimitMap.size > 500) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.every(t => now - t > windowMs)) {
        rateLimitMap.delete(k);
      }
    }
  }
  
  return {
    allowed: true,
    remaining: limit - validTimestamps.length,
    resetMs: windowMs
  };
}

/**
 * Resets rate limit for a specific key upon successful authentication.
 * @param {string} key 
 */
export function clearRateLimit(key) {
  rateLimitMap.delete(key);
}

/**
 * Extract client IP address safely from incoming request headers.
 * @param {Request} request 
 * @returns {string}
 */
export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}
