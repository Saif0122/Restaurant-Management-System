import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import foodRoutes from './food.routes';
import cartRoutes from './cart.routes';
import favoriteRoutes from './favorite.routes';
import orderRoutes from './order.routes';
import reservationRoutes from './reservation.routes';
import reviewRoutes from './review.routes';
import couponRoutes from './coupon.routes';
import notificationRoutes from './notification.routes';
import profileRoutes from './profile.routes';
import adminRoutes from './admin';
import staffRoutes from './staff';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/foods', foodRoutes);
router.use('/cart', cartRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/orders', orderRoutes);
router.use('/reservations', reservationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);
router.use('/notifications', notificationRoutes);
router.use('/profile', profileRoutes);
router.use('/staff', staffRoutes);
router.use('/payments', paymentRoutes);

export default router;
