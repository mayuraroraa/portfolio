// Lightweight sliding-window rate limiter in memory with distributed Upstash Redis support
const rateLimitMap = new Map();

const isUpstashConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

/**
 * Check if an IP has exceeded limit within windowMs (in-memory sliding-window)
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
 * Distributed rate limiter using Upstash Redis REST API.
 * Safely falls back to in-memory sliding-window limiter if Upstash is unconfigured or network fails.
 * @param {string} key
 * @param {number} limit
 * @param {number} windowMs
 * @returns {Promise<{ allowed: boolean, remaining: number, resetMs: number }>}
 */
export async function checkDistributedRateLimit(key, limit = 5, windowMs = 15 * 60 * 1000) {
  if (isUpstashConfigured) {
    try {
      const url = process.env.UPSTASH_REDIS_REST_URL.replace(/\/$/, '');
      const token = process.env.UPSTASH_REDIS_REST_TOKEN;
      const ttlSeconds = Math.ceil(windowMs / 1000);
      const redisKey = `ratelimit:${key}`;

      // Pipeline INCR and EXPIRE in a single HTTP request to avoid latency
      const response = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          ['INCR', redisKey],
          ['EXPIRE', redisKey, ttlSeconds]
        ]),
        cache: 'no-store'
      });

      if (response.ok) {
        const results = await response.json();
        const currentCount = typeof results[0]?.result === 'number' ? results[0].result : 1;
        
        if (currentCount > limit) {
          return {
            allowed: false,
            remaining: 0,
            resetMs: windowMs
          };
        }

        return {
          allowed: true,
          remaining: Math.max(0, limit - currentCount),
          resetMs: windowMs
        };
      }
    } catch (err) {
      console.warn('[RateLimit] Upstash Redis check failed, using in-memory fallback:', err.message);
    }
  }

  // Graceful fallback to memory limiter
  return checkRateLimit(key, limit, windowMs);
}

/**
 * Resets rate limit for a specific key across memory and distributed Redis.
 * @param {string} key 
 */
export async function clearDistributedRateLimit(key) {
  clearRateLimit(key);
  if (isUpstashConfigured) {
    try {
      const url = process.env.UPSTASH_REDIS_REST_URL.replace(/\/$/, '');
      const token = process.env.UPSTASH_REDIS_REST_TOKEN;
      const redisKey = `ratelimit:${key}`;
      await fetch(`${url}/del/${redisKey}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    } catch {}
  }
}

/**
 * Resets rate limit for a specific key in memory.
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
