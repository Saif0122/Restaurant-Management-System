import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { UserRole } from '../../models/User.model';

const router = Router();

import analyticsRoutes from './analytics.routes';
import userRoutes from './user.routes';
import foodRoutes from './food.routes';
import categoryRoutes from './category.routes';
import couponRoutes from './coupon.routes';
import bannerRoutes from './banner.routes';
import reservationRoutes from './reservation.routes';
import orderRoutes from './order.routes';
import reportRoutes from './report.routes';
import activityLogRoutes from './activityLog.routes';

// Apply auth middleware to all admin routes
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.use('/analytics', analyticsRoutes);
router.use('/users', userRoutes);
router.use('/foods', foodRoutes);
router.use('/categories', categoryRoutes);
router.use('/coupons', couponRoutes);
router.use('/banners', bannerRoutes);
router.use('/reservations', reservationRoutes);
router.use('/orders', orderRoutes);
router.use('/reports', reportRoutes);
router.use('/activity-logs', activityLogRoutes);

export default router;
