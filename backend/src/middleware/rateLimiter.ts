import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const rateLimiter = new RateLimiterMemory({
  points: 15, // 15 requests
  duration: 10, // per 10 seconds by User
});

export const rateLimitMiddleware = (req: Request | any, res: Response, next: NextFunction) => {
  const identifier = req.auth?.userId || req.ip;
  rateLimiter.consume(identifier)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({ error: "Too Many Requests. Rate limit exceeded for AI interactions." });
    });
};
