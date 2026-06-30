import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import activityLogService from '../../services/admin/activityLog.service';

class ActivityLogController {
  public getActivityLogs = asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', limit = '10', action, entity, search } = req.query;
    const result = await activityLogService.getActivityLogs({
      page: Number(page),
      limit: Number(limit),
      action: action as string,
      entity: entity as string,
      search: search as string,
    });
    res.status(200).json(new ApiResponse(200, result, 'Activity logs retrieved successfully'));
  });
}

export default new ActivityLogController();
