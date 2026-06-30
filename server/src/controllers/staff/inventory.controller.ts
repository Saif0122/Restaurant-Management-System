import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { InventoryService } from '../../services/staff/inventory.service';

export const getLowStockAlerts = asyncHandler(async (req: Request, res: Response) => {
  const threshold = req.query.threshold ? parseInt(req.query.threshold as string, 10) : 10;
  const items = await InventoryService.getLowStockAlerts(threshold);
  res.status(200).json(new ApiResponse(200, 'Low stock items retrieved successfully', items));
});

export const getOutOfStockAlerts = asyncHandler(async (_req: Request, res: Response) => {
  const items = await InventoryService.getOutOfStockAlerts();
  res.status(200).json(new ApiResponse(200, 'Out of stock items retrieved successfully', items));
});

export const createRestockRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const request = await InventoryService.createRestockRequest(userId, req.body);
  res.status(201).json(new ApiResponse(201, 'Restock request created successfully', request));
});

export const getRestockRequests = asyncHandler(async (_req: Request, res: Response) => {
  const requests = await InventoryService.getRestockRequests();
  res.status(200).json(new ApiResponse(200, 'Restock requests retrieved successfully', requests));
});
