import { Request, Response } from 'express';
import * as foodService from '../services/food.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const createFood = asyncHandler(async (req: Request, res: Response) => {
  // Multer populates req.files for array uploads
  const imageFiles = req.files as Express.Multer.File[] | undefined;
  const food = await foodService.createFood(req.body, imageFiles);
  res.status(201).json(new ApiResponse(201, 'Food created successfully', food));
});

export const getFoods = asyncHandler(async (req: Request, res: Response) => {
  const result = await foodService.getFoods(req.query);
  res.status(200).json(new ApiResponse(200, 'Foods retrieved successfully', result));
});

export const getFoodById = asyncHandler(async (req: Request, res: Response) => {
  const food = await foodService.getFoodById(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Food retrieved successfully', food));
});

export const getFoodBySlug = asyncHandler(async (req: Request, res: Response) => {
  const food = await foodService.getFoodBySlug(req.params.slug);
  res.status(200).json(new ApiResponse(200, 'Food retrieved successfully', food));
});

export const updateFood = asyncHandler(async (req: Request, res: Response) => {
  const imageFiles = req.files as Express.Multer.File[] | undefined;
  const food = await foodService.updateFood(req.params.id, req.body, imageFiles);
  res.status(200).json(new ApiResponse(200, 'Food updated successfully', food));
});

export const deleteFood = asyncHandler(async (req: Request, res: Response) => {
  await foodService.deleteFood(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Food deleted successfully', null));
});

// Special endpoints
export const getFeaturedFoods = asyncHandler(async (_req: Request, res: Response) => {
  const foods = await foodService.getSpecialCategoryFoods('featured');
  res.status(200).json(new ApiResponse(200, 'Featured foods retrieved successfully', foods));
});

export const getPopularFoods = asyncHandler(async (_req: Request, res: Response) => {
  const foods = await foodService.getSpecialCategoryFoods('popular');
  res.status(200).json(new ApiResponse(200, 'Popular foods retrieved successfully', foods));
});

export const getNewFoods = asyncHandler(async (_req: Request, res: Response) => {
  const foods = await foodService.getSpecialCategoryFoods('new');
  res.status(200).json(new ApiResponse(200, 'New foods retrieved successfully', foods));
});

export const getTodaySpecialFoods = asyncHandler(async (_req: Request, res: Response) => {
  const foods = await foodService.getSpecialCategoryFoods('today-special');
  res.status(200).json(new ApiResponse(200, 'Today special foods retrieved successfully', foods));
});

export const getRelatedFoods = asyncHandler(async (req: Request, res: Response) => {
  const foods = await foodService.getRelatedFoods(req.params.slug);
  res.status(200).json(new ApiResponse(200, 'Related foods retrieved successfully', foods));
});

// Note: getFoodsByCategory and searchFoods are handled by getFoods with query parameters
export const getFoodsByCategory = asyncHandler(async (req: Request, res: Response) => {
  // Use getFoods but force the category filter
  req.query.category = req.params.slug;
  const result = await foodService.getFoods(req.query);
  res.status(200).json(new ApiResponse(200, 'Category foods retrieved successfully', result));
});

export const searchFoods = asyncHandler(async (req: Request, res: Response) => {
  // Use getFoods but force the search filter
  if (!req.query.search) {
    res
      .status(200)
      .json(new ApiResponse(200, 'Search query required', { foods: [], pagination: {} }));
    return;
  }
  const result = await foodService.getFoods(req.query);
  res.status(200).json(new ApiResponse(200, 'Search results retrieved successfully', result));
});
