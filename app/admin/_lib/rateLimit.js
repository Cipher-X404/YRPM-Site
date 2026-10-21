// In-memory login throttling. Replace with Redis/Upstash when the backend lands,
// because serverless instances do not share this Map.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_KEYS = 5000;

const buckets = new Map();

function prune(now) {
  if (buckets.size < MAX_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.blockedUntil <= now && bucket.last < now - WINDOW_MS)
      buckets.delete(key);
    if (buckets.size < MAX_KEYS * 0.8) break;
  }
}

export function checkRateLimit(key, now = Date.now()) {
  prune(now);
  const bucket = buckets.get(key);
  if (!bucket) return { allowed: true, remaining: MAX_ATTEMPTS, retryAfter: 0 };
  if (bucket.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((bucket.blockedUntil - now) / 1000),
    };
  }
  if (now - bucket.first > WINDOW_MS) {
    buckets.delete(key);
    return { allowed: true, remaining: MAX_ATTEMPTS, retryAfter: 0 };
  }
  return {
    allowed: true,
    remaining: Math.max(0, MAX_ATTEMPTS - bucket.count),
    retryAfter: 0,
  };
}

export function recordFailure(key, now = Date.now()) {
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.first > WINDOW_MS) {
    buckets.set(key, { count: 1, first: now, last: now, blockedUntil: 0 });
    return;
  }
  bucket.count += 1;
  bucket.last = now;
  if (bucket.count >= MAX_ATTEMPTS) bucket.blockedUntil = now + WINDOW_MS;
}

export function clearFailures(key) {
  buckets.delete(key);
}

export function resetRateLimits() {
  buckets.clear();
}

export const RATE_LIMIT = { windowMs: WINDOW_MS, maxAttempts: MAX_ATTEMPTS };
