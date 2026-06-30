import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import orderService from '../../services/admin/order.service';
import { OrderStatus } from '../../models/Order.model';

class OrderController {
  public getOrders = asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', limit = '10', status, search, date } = req.query;
    const result = await orderService.getOrders({
      page: Number(page),
      limit: Number(limit),
      status: status as string,
      search: search as string,
      date: date as string,
    });
    res.status(200).json(new ApiResponse(200, result, 'Orders retrieved successfully'));
  });

  public getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json(new ApiResponse(200, order, 'Order retrieved successfully'));
  });

  public updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status, note } = req.body;
    const order = await orderService.updateStatus(req.params.id, status as OrderStatus, note);
    res.status(200).json(new ApiResponse(200, order, 'Order status updated successfully'));
  });

  public getOrderTimeline = asyncHandler(async (req: Request, res: Response) => {
    const timeline = await orderService.getOrderTimeline(req.params.id);
    res.status(200).json(new ApiResponse(200, timeline, 'Order timeline retrieved successfully'));
  });
}

export default new OrderController();
