import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ReviewService } from '../services/review.service';

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();

  const review = await ReviewService.createReview(userId, req.body);

  res.status(201).json(new ApiResponse(201, 'Review created successfully', review));
});

export const getFoodReviews = asyncHandler(async (req: Request, res: Response) => {
  const { foodId } = req.params;

  const reviews = await ReviewService.getFoodReviews(foodId);

  res.status(200).json(new ApiResponse(200, 'Reviews retrieved successfully', reviews));
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;

  const review = await ReviewService.updateReview(userId, id, req.body);

  res.status(200).json(new ApiResponse(200, 'Review updated successfully', review));
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;

  await ReviewService.deleteReview(userId, id);

  res.status(200).json(new ApiResponse(200, 'Review deleted successfully', null));
});
