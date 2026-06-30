import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { placeOrderSchema, orderIdParamSchema } from '../validators/order.validator';
import {
  placeOrder,
  getOrderHistory,
  getOrderById,
  cancelOrder,
} from '../controllers/order.controller';

const router = Router();

// All order routes require authentication
router.use(authenticate);

router.route('/').get(getOrderHistory).post(validate(placeOrderSchema), placeOrder);

router.route('/:id').get(validate(orderIdParamSchema), getOrderById);

router.route('/:id/cancel').put(validate(orderIdParamSchema), cancelOrder);

export default router;
