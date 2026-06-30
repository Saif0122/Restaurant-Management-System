import { Router } from 'express';
import couponController from '../../controllers/admin/coupon.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  createCouponSchema,
  updateCouponSchema,
  idParamSchema,
} from '../../validators/admin.validator';

const router = Router();

router.get('/', couponController.getCoupons);
router.get('/:id', validate(idParamSchema), couponController.getCouponById);
router.post('/', validate(createCouponSchema), couponController.createCoupon);
router.patch('/:id', validate(updateCouponSchema), couponController.updateCoupon);
router.delete('/:id', validate(idParamSchema), couponController.deleteCoupon);

export default router;
