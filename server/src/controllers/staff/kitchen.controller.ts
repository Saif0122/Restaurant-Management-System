import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { KitchenService } from '../../services/staff/kitchen.service';

export const getPendingOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await KitchenService.getPendingOrders();
  res.status(200).json(new ApiResponse(200, 'Pending orders retrieved successfully', orders));
});

export const getPreparingOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await KitchenService.getPreparingOrders();
  res.status(200).json(new ApiResponse(200, 'Preparing orders retrieved successfully', orders));
});

export const getReadyOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await KitchenService.getReadyOrders();
  res.status(200).json(new ApiResponse(200, 'Ready orders retrieved successfully', orders));
});

export const getKitchenStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await KitchenService.getKitchenStats();
  res.status(200).json(new ApiResponse(200, 'Kitchen stats retrieved successfully', stats));
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await KitchenService.updateOrderStatus(id, status);
  res.status(200).json(new ApiResponse(200, 'Order status updated successfully', order));
});

export const updateKitchenNotes = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { kitchenNotes } = req.body;
  const order = await KitchenService.updateKitchenNotes(id, kitchenNotes);
  res.status(200).json(new ApiResponse(200, 'Kitchen notes updated successfully', order));
});

export const updateEstimatedPrepTime = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estimatedPrepTime } = req.body;
  const order = await KitchenService.updateEstimatedPrepTime(id, estimatedPrepTime);
  res.status(200).json(new ApiResponse(200, 'Estimated prep time updated successfully', order));
});
