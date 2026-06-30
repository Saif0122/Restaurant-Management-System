import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie.util';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await AuthService.register(req.body);
    setAuthCookies(res, accessToken, refreshToken);
    res
      .status(201)
      .json(new ApiResponse(201, 'User registered successfully. Please verify your email.', user));
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await AuthService.login(req.body);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json(new ApiResponse(200, 'Login successful', user));
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    if (req.user) {
      await AuthService.logout(req.user._id.toString());
    } else if (req.cookies.refreshToken) {
      // Best effort to clear by token if user object isn't attached
      const token = req.cookies.refreshToken;
      try {
        const { verifyRefreshToken } = await import('../utils/jwt.util');
        const decoded = verifyRefreshToken(token);
        await AuthService.logout(decoded.id);
      } catch (e) {
        // ignore
      }
    }
    clearAuthCookies(res);
    res.status(200).json(new ApiResponse(200, 'Logged out successfully', null));
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingToken) {
      res.status(401).json(new ApiResponse(401, 'Refresh token is missing', null));
      return;
    }

    const { user, accessToken, refreshToken } = await AuthService.refresh(incomingToken);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json(new ApiResponse(200, 'Token refreshed successfully', user));
  });

  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    await AuthService.forgotPassword(req.body.email);
    res
      .status(200)
      .json(new ApiResponse(200, 'If an account exists, a password reset email was sent', null));
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    await AuthService.resetPassword(req.body);
    res.status(200).json(new ApiResponse(200, 'Password reset successful', null));
  });

  static verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    await AuthService.verifyEmail(req.body.token);
    res.status(200).json(new ApiResponse(200, 'Email verified successfully', null));
  });

  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    // req.user is guaranteed by authenticate middleware
    await AuthService.changePassword(req.user!._id.toString(), req.body);
    res.status(200).json(new ApiResponse(200, 'Password changed successfully', null));
  });

  static getMe = asyncHandler(async (req: Request, res: Response) => {
    // req.user is guaranteed by authenticate middleware
    const user = await AuthService.getMe(req.user!._id.toString());
    res.status(200).json(new ApiResponse(200, 'User fetched successfully', user));
  });
}
