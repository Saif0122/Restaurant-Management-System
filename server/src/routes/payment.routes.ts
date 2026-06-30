import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { validate } from '../middleware/validate.middleware';
import * as paymentValidator from '../validators/payment.validator';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Customer and Admin shared routes
router.use(authenticate);

router.post(
  '/create-intent',
  validate(paymentValidator.createIntentSchema),
  paymentController.createIntent,
);
router.post(
  '/confirm',
  validate(paymentValidator.confirmPaymentSchema),
  paymentController.confirmPayment,
);
router.get('/history', paymentController.getHistory);
router.get('/:id', paymentController.getPaymentById);
router.post(
  '/refund/:id/request',
  validate(paymentValidator.requestRefundSchema),
  paymentController.requestRefund,
);

// Admin only routes
router.use(authorize('Admin'));
router.post(
  '/refund/:id/approve',
  validate(paymentValidator.approveRejectRefundSchema),
  paymentController.approveRefund,
);
router.post(
  '/refund/:id/reject',
  validate(paymentValidator.approveRejectRefundSchema),
  paymentController.rejectRefund,
);

export default router;
