import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { FavoriteService } from '../services/favorite.service';

export const getFavorites = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const favorites = await FavoriteService.getFavorites(userId);

  res.status(200).json(new ApiResponse(200, 'Favorites retrieved successfully', favorites));
});

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { foodId } = req.params;

  const favorite = await FavoriteService.addFavorite(userId, foodId);

  res.status(201).json(new ApiResponse(201, 'Added to favorites successfully', favorite));
});

export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { foodId } = req.params;

  await FavoriteService.removeFavorite(userId, foodId);

  res.status(200).json(new ApiResponse(200, 'Removed from favorites successfully', null));
});
