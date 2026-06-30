import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body, req.file);
  res.status(201).json(new ApiResponse(201, 'Category created successfully', category));
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.getCategories(req.query);
  res.status(200).json(new ApiResponse(200, 'Categories retrieved successfully', result));
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Category retrieved successfully', category));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id, req.body, req.file);
  res.status(200).json(new ApiResponse(200, 'Category updated successfully', category));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Category deleted successfully', null));
});
