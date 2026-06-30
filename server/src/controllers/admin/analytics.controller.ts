import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import analyticsService from '../../services/admin/analytics.service';

class AnalyticsController {
  public getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await analyticsService.getDashboardStats();
    res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats retrieved successfully'));
  });
}

export default new AnalyticsController();
