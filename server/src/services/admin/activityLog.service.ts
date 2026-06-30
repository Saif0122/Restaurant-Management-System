import ActivityLog from '../../../models/ActivityLog.model';
import { FilterQuery } from 'mongoose';

class ActivityLogService {
  public async logAction(data: {
    user: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: any;
    ipAddress?: string;
  }) {
    const log = new ActivityLog(data);
    await log.save();
    return log;
  }

  public async getActivityLogs(options: {
    page: number;
    limit: number;
    action?: string;
    entity?: string;
    search?: string;
  }) {
    const { page, limit, action, entity, search } = options;
    const skip = (page - 1) * limit;

    const query: FilterQuery<any> = {};

    if (action) {
      query.action = action;
    }
    if (entity) {
      query.entity = entity;
    }

    // We can search action or entity
    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { entity: { $regex: search, $options: 'i' } },
      ];
    }

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('user', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default new ActivityLogService();
