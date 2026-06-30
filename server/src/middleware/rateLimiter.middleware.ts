import rateLimit from 'express-rate-limit';
import config from '../config';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../constants';

/**
 * Express rate limiting middleware to prevent brute force and DDoS attacks.
 * Uses config parameters for max requests and window duration.
 */
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req, _res, next) => {
    next(
      new ApiError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        'Too many requests from this IP, please try again later.',
      ),
    );
  },
});
