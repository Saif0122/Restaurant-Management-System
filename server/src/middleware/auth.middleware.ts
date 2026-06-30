import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import User from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request: No token provided');
    }

    try {
      const decoded = verifyAccessToken(token);

      // Fetch user to ensure they still exist and check passwordChangedAt
      const user = await User.findById(decoded.id).select('+passwordChangedAt');

      if (!user) {
        throw new ApiError(401, 'User belonging to this token no longer exists');
      }

      if (!user.isActive) {
        throw new ApiError(401, 'User account is inactive or soft-deleted');
      }

      // Check if password was changed after the token was issued
      // This is optional but highly recommended for security
      if (user.passwordChangedAt) {
        // Decode is mostly untyped for 'iat' (issued at) but it exists in JWT payloads
        // We do a hacky generic cast to any to get iat
        const decodedAny = decoded as any;
        if (decodedAny.iat) {
          const changedTimestamp = parseInt(
            (user.passwordChangedAt.getTime() / 1000).toString(),
            10,
          );
          if (decodedAny.iat < changedTimestamp) {
            throw new ApiError(401, 'User recently changed password! Please log in again.');
          }
        }
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired access token');
    }
  },
);

export const OptionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Ignore invalid token since auth is optional
    }
    next();
  },
);

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized request');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `User role '${req.user.role}' is not authorized to access this route`,
      );
    }

    next();
  };
};
