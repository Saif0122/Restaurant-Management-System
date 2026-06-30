import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ProfileService } from '../services/profile.service';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const profile = await ProfileService.getProfile(userId);
  res.status(200).json(new ApiResponse(200, 'Profile retrieved successfully', profile));
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const profile = await ProfileService.updateProfile(userId, req.body);
  res.status(200).json(new ApiResponse(200, 'Profile updated successfully', profile));
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  // This expects the upload middleware to have placed the cloudinary URL in req.file.path or similar
  // For now, assuming it's sent in body if no upload middleware is attached to this specific route during Phase 6
  const avatarUrl = req.body.avatarUrl || (req.file as any)?.path;
  const profile = await ProfileService.updateAvatar(userId, avatarUrl);
  res.status(200).json(new ApiResponse(200, 'Avatar updated successfully', profile));
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  await ProfileService.deleteAccount(userId);
  // Clear the JWT cookie as well since the account is deleted
  res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.status(200).json(new ApiResponse(200, 'Account deleted successfully', null));
});

export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const addresses = await ProfileService.getAddresses(userId);
  res.status(200).json(new ApiResponse(200, 'Addresses retrieved successfully', addresses));
});

export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const address = await ProfileService.addAddress(userId, req.body);
  res.status(201).json(new ApiResponse(201, 'Address added successfully', address));
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;
  const address = await ProfileService.updateAddress(userId, id, req.body);
  res.status(200).json(new ApiResponse(200, 'Address updated successfully', address));
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;
  await ProfileService.deleteAddress(userId, id);
  res.status(200).json(new ApiResponse(200, 'Address deleted successfully', null));
});
