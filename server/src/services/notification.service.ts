import Notification, { INotification } from '../models/Notification.model';
import { ApiError } from '../utils/ApiError';

export class NotificationService {
  /**
   * Get all notifications for a user
   */
  static async getNotifications(userId: string): Promise<INotification[]> {
    return Notification.find({ recipient: userId }).sort({ createdAt: -1 });
  }

  /**
   * Mark a specific notification as read
   */
  static async markAsRead(userId: string, notificationId: string): Promise<INotification> {
    const notification = await Notification.findOne({ _id: notificationId, recipient: userId });

    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    notification.read = true;

    await notification.save();
    return notification;
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany({ recipient: userId, read: false }, { $set: { read: true } });
  }

  /**
   * Delete a specific notification
   */
  static async deleteNotification(userId: string, notificationId: string): Promise<void> {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }
  }
}
