import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { notificationIdParamSchema } from '../validators/notification.validator';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller';

const router = Router();

router.use(authenticate);

router.route('/').get(getNotifications);

router.put('/read-all', markAllAsRead);

router.route('/:id').delete(validate(notificationIdParamSchema), deleteNotification);

router.put('/:id/read', validate(notificationIdParamSchema), markAsRead);

export default router;
