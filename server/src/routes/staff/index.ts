import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { UserRole } from '../../models/User.model';

import kitchenRoutes from './kitchen.routes';
import reservationRoutes from './reservation.routes';
import deliveryRoutes from './delivery.routes';
import waiterRoutes from './waiter.routes';
import inventoryRoutes from './inventory.routes';
import shiftRoutes from './shift.routes';
import profileRoutes from '../profile.routes';
import notificationRoutes from '../notification.routes';

const router = Router();

// Staff authentication is required for all routes
router.use(authenticate);

router.use(
  '/kitchen',
  authorize(UserRole.KITCHEN_STAFF, UserRole.MANAGER, UserRole.ADMIN),
  kitchenRoutes,
);

router.use(
  '/reservations',
  authorize(UserRole.CASHIER, UserRole.MANAGER, UserRole.ADMIN),
  reservationRoutes,
);

router.use(
  '/delivery',
  authorize(UserRole.DELIVERY_RIDER, UserRole.MANAGER, UserRole.ADMIN),
  deliveryRoutes,
);

router.use('/waiter', authorize(UserRole.WAITER, UserRole.MANAGER, UserRole.ADMIN), waiterRoutes);

router.use(
  '/inventory',
  authorize(UserRole.KITCHEN_STAFF, UserRole.MANAGER, UserRole.ADMIN),
  inventoryRoutes,
);

router.use(
  '/shifts',
  authorize(
    UserRole.KITCHEN_STAFF,
    UserRole.CASHIER,
    UserRole.WAITER,
    UserRole.DELIVERY_RIDER,
    UserRole.MANAGER,
    UserRole.ADMIN,
  ),
  shiftRoutes,
);

// Staff can use the normal profile and notifications routes
router.use('/profile', profileRoutes);
router.use('/notifications', notificationRoutes);

export default router;
