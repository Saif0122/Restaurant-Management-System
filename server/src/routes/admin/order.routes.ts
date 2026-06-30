import { Router } from 'express';
import orderController from '../../controllers/admin/order.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  updateOrderStatusSchema,
  idParamSchema,
  paginationSchema,
} from '../../validators/admin.validator';

const router = Router();

router.get('/', validate(paginationSchema), orderController.getOrders);
router.get('/:id', validate(idParamSchema), orderController.getOrderById);
router.patch('/:id/status', validate(updateOrderStatusSchema), orderController.updateStatus);
router.get('/:id/timeline', validate(idParamSchema), orderController.getOrderTimeline);

export default router;
