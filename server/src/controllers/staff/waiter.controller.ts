import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { WaiterService } from '../../services/staff/waiter.service';

export const getDineInOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await WaiterService.getDineInOrders();
  res.status(200).json(new ApiResponse(200, 'Dine-in orders retrieved successfully', orders));
});

export const getActiveTables = asyncHandler(async (_req: Request, res: Response) => {
  const tables = await WaiterService.getActiveTables();
  res.status(200).json(new ApiResponse(200, 'Active tables retrieved successfully', tables));
});

export const assignTableToOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tableNumber } = req.body;
  const order = await WaiterService.assignTableToOrder(id, tableNumber);
  res.status(200).json(new ApiResponse(200, 'Table assigned successfully', order));
});

export const addOrderNotes = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;
  const order = await WaiterService.addOrderNotes(id, notes);
  res.status(200).json(new ApiResponse(200, 'Order notes updated successfully', order));
});

export const completeOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await WaiterService.completeOrder(id);
  res.status(200).json(new ApiResponse(200, 'Dine-in order completed successfully', order));
});
