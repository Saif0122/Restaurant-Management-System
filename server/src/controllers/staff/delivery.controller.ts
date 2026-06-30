import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { DeliveryService } from '../../services/staff/delivery.service';

export const getDeliveries = asyncHandler(async (req: Request, res: Response) => {
  const deliveries = await DeliveryService.getDeliveries(req.query);
  res.status(200).json(new ApiResponse(200, 'Deliveries retrieved successfully', deliveries));
});

export const assignRider = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { riderId } = req.body;
  const order = await DeliveryService.assignRider(id, riderId);
  res.status(200).json(new ApiResponse(200, 'Rider assigned successfully', order));
});

export const acceptDelivery = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const riderId = req.user!._id.toString();
  const order = await DeliveryService.acceptDelivery(id, riderId);
  res.status(200).json(new ApiResponse(200, 'Delivery accepted successfully', order));
});

export const markOutForDelivery = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const riderId = req.user!._id.toString();
  const order = await DeliveryService.markOutForDelivery(id, riderId);
  res.status(200).json(new ApiResponse(200, 'Order out for delivery', order));
});

export const markDelivered = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const riderId = req.user!._id.toString();
  const order = await DeliveryService.markDelivered(id, riderId);
  res.status(200).json(new ApiResponse(200, 'Order delivered successfully', order));
});

export const getDeliveryHistory = asyncHandler(async (req: Request, res: Response) => {
  const riderId = req.user!._id.toString();
  const history = await DeliveryService.getDeliveryHistory(riderId, req.query);
  res.status(200).json(new ApiResponse(200, 'Delivery history retrieved successfully', history));
});
