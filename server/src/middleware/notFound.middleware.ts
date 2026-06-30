import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../constants';

/**
 * Middleware to handle unmatched routes (404 Not Found).
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(
    new ApiError(
      HTTP_STATUS.NOT_FOUND,
      `Cannot find ${req.method} ${req.originalUrl} on this server`,
    ),
  );
};
