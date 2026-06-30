import { Response } from 'express';
import config from '../config';

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = config.env === 'production';
  const accessExpires = parseExpiresInToMs(config.jwt.accessExpiresIn);
  const refreshExpires = parseExpiresInToMs(config.jwt.refreshExpiresIn);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: accessExpires,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: refreshExpires,
    path: '/api/v1/auth/refresh-token', // Refresh token is only sent on refresh endpoint
  });
};

export const clearAuthCookies = (res: Response) => {
  const isProd = config.env === 'production';

  res.cookie('accessToken', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 0,
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 0,
    path: '/api/v1/auth/refresh-token',
  });
};

/**
 * Parses JWT expiresIn strings (like '15m', '7d') into milliseconds.
 * This is a basic implementation. For production, consider using 'ms' package.
 */
const parseExpiresInToMs = (expiresIn: string): number => {
  const time = parseInt(expiresIn.slice(0, -1));
  const unit = expiresIn.slice(-1);

  switch (unit) {
    case 's':
      return time * 1000;
    case 'm':
      return time * 60 * 1000;
    case 'h':
      return time * 60 * 60 * 1000;
    case 'd':
      return time * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000; // default 15 minutes
  }
};
