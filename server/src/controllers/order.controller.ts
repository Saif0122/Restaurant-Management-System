import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { OrderService } from '../services/order.service';

export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { deliveryAddressId, couponId, notes } = req.body;

  const order = await OrderService.placeOrder(userId, { deliveryAddressId, couponId, notes });

  res.status(201).json(new ApiResponse(201, 'Order placed successfully', order));
});

export const getOrderHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();

  const orders = await OrderService.getOrderHistory(userId);

  res.status(200).json(new ApiResponse(200, 'Order history retrieved successfully', orders));
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;

  const order = await OrderService.getOrderById(userId, id);

  res.status(200).json(new ApiResponse(200, 'Order details retrieved successfully', order));
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;

  const order = await OrderService.cancelOrder(userId, id);

  res.status(200).json(new ApiResponse(200, 'Order cancelled successfully', order));
});
