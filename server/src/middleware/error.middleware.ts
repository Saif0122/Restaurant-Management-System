import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import logger from '../utils/logger';
import config from '../config';

/**
 * Global Error Handling Middleware.
 * Captures all standard and custom errors, logging them and sending a standardized response.
 */
export const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  let error = err;

  // Convert non-ApiError errors to custom ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(config.env === 'development' && { stack: error.stack }),
  };

  // Log detailed error/warnings
  if (error.statusCode >= 500) {
    logger.error(
      `[${req.method}] ${req.path} - 500 Internal Server Error: ${error.message}\nStack: ${error.stack}`,
    );
  } else {
    logger.warn(`[${req.method}] ${req.path} - ${error.statusCode} Warning: ${error.message}`);
  }

  res.status(error.statusCode).json(response);
};
