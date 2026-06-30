import { Router } from 'express';
import {
  getPendingOrders,
  getPreparingOrders,
  getReadyOrders,
  getKitchenStats,
  updateOrderStatus,
  updateKitchenNotes,
  updateEstimatedPrepTime,
} from '../../controllers/staff/kitchen.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  updateOrderStatusSchema,
  updateKitchenNotesSchema,
  updateEstimatedPrepTimeSchema,
} from '../../validators/staff.validator';

const router = Router();

router.get('/orders/pending', getPendingOrders);
router.get('/orders/preparing', getPreparingOrders);
router.get('/orders/ready', getReadyOrders);
router.get('/stats', getKitchenStats);

router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

router.patch('/orders/:id/notes', validate(updateKitchenNotesSchema), updateKitchenNotes);

router.patch(
  '/orders/:id/prep-time',
  validate(updateEstimatedPrepTimeSchema),
  updateEstimatedPrepTime,
);

export default router;
