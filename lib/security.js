// In-memory rate limiting map: ip -> { count, resetTime }
const rateLimitMap = new Map();

/**
 * Basic in-memory rate limiter for Next.js API routes
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 * @param {Object} options
 * @param {number} options.limit Maximum requests allowed within windowMs
 * @param {number} options.windowMs Window in milliseconds (default 1 minute)
 * @returns {boolean} True if request is allowed, false if rate limited
 */
export function applyRateLimit(req, res, { limit = 60, windowMs = 60 * 1000 } = {}) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '127.0.0.1';
  const now = Date.now();

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  record.count += 1;

  if (record.count > limit) {
    res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
    res.status(429).json({ error: 'Too many requests. Please slow down and try again shortly.' });
    return false;
  }

  return true;
}

/**
 * Validates Origin/Referer header against public URL for state-modifying requests
 */
export function validateOrigin(req, res) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return true;

  const origin = req.headers['origin'] || req.headers['referer'];
  // Allow internal requests or development environments
  if (!origin || process.env.NODE_ENV !== 'production') return true;

  const allowedDomain = process.env.PUBLIC_URL ? new URL(process.env.PUBLIC_URL).hostname : null;
  if (allowedDomain) {
    try {
      const originHost = new URL(origin).hostname;
      if (originHost !== allowedDomain && originHost !== 'localhost') {
        res.status(403).json({ error: 'Cross-origin request rejected' });
        return false;
      }
    } catch (e) {
      return true;
    }
  }

  return true;
}

/**
 * Sanitizes input string to prevent XSS / injection attacks
 */
export function sanitizeString(val, maxLength = 250) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates email format with regex
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
