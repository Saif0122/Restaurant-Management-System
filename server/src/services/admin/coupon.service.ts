import Coupon from '../../../models/Coupon.model';
import { ApiError } from '../../../utils/ApiError';

class CouponService {
  public async getCoupons() {
    return await Coupon.find().sort({ createdAt: -1 });
  }

  public async getCouponById(id: string) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }
    return coupon;
  }

  public async createCoupon(data: any) {
    const existing = await Coupon.findOne({ code: data.code });
    if (existing) {
      throw new ApiError(400, 'Coupon code already exists');
    }
    const coupon = new Coupon(data);
    await coupon.save();
    return coupon;
  }

  public async updateCoupon(id: string, data: any) {
    const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }
    return coupon;
  }

  public async deleteCoupon(id: string) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }
    return coupon;
  }
}

export default new CouponService();
