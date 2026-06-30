import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { NotificationService } from '../services/notification.service';

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();

  const notifications = await NotificationService.getNotifications(userId);

  res.status(200).json(new ApiResponse(200, 'Notifications retrieved successfully', notifications));
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;

  const notification = await NotificationService.markAsRead(userId, id);

  res.status(200).json(new ApiResponse(200, 'Notification marked as read', notification));
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();

  await NotificationService.markAllAsRead(userId);

  res.status(200).json(new ApiResponse(200, 'All notifications marked as read', null));
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;

  await NotificationService.deleteNotification(userId, id);

  res.status(200).json(new ApiResponse(200, 'Notification deleted successfully', null));
});
