import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { validateCouponSchema } from '../validators/coupon.validator';
import { validateCoupon } from '../controllers/coupon.controller';

const router = Router();

router.use(authenticate);

router.post('/validate', validate(validateCouponSchema), validateCoupon);

export default router;
