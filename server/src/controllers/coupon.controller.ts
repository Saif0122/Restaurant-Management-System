import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { CouponService } from '../services/coupon.service';

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { code } = req.body;

  const result = await CouponService.validateCoupon(userId, code);

  res.status(200).json(new ApiResponse(200, 'Coupon applied successfully', result));
});
