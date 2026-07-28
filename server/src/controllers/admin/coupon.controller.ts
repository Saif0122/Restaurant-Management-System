import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import couponService from '../../services/admin/coupon.service';

class CouponController {
  public getCoupons = asyncHandler(async (_req: Request, res: Response) => {
    const coupons = await couponService.getCoupons();
    res.status(200).json(new ApiResponse(200, coupons, 'Coupons retrieved successfully'));
  });

  public getCouponById = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await couponService.getCouponById(req.params.id);
    res.status(200).json(new ApiResponse(200, coupon, 'Coupon retrieved successfully'));
  });

  public createCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json(new ApiResponse(201, coupon, 'Coupon created successfully'));
  });

  public updateCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, coupon, 'Coupon updated successfully'));
  });

  public deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
    await couponService.deleteCoupon(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Coupon deleted successfully'));
  });
}

export default new CouponController();
