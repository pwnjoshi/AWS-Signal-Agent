import { Request, Response, NextFunction } from 'express';

// In-memory sliding window rate limiter
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Sliding Window Rate Limiter Middleware
 * @param maxRequests Maximum allowed requests in the time window
 * @param windowMs Time window in milliseconds (default: 15 minutes)
 */
export function rateLimiter(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Extract IP address behind AWS Lambda / CloudFront / S3 proxy
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress) || '127.0.0.1';
    
    const key = `${ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();

    const record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded for this endpoint. Please try again in ${retryAfterSeconds} seconds.`,
        retry_after: retryAfterSeconds,
      });
    }

    record.count++;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - record.count);
    next();
  };
}

/**
 * Security Guard Middleware for API Authentication & Security Headers
 */
export function apiSecurityGuard(req: Request, res: Response, next: NextFunction) {
  // Apply standard HTTP Security Headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Allow root GET / and /health status without API key for load balancers
  if (req.path === '/' || req.path === '/health') {
    return next();
  }

  // Validate Secret API Key Header
  const expectedKey = process.env.API_SECRET_KEY || 'aws-signal-secret-key-2026';
  const providedKey = req.headers['x-api-key'] || (req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '') : '');

  if (providedKey !== expectedKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied. Valid X-API-Key or Authorization header is required to access AWS Signal APIs.',
      status: 401,
    });
  }

  next();
}
