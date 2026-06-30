import Coupon, { ICoupon, DiscountType } from '../models/Coupon.model';
import Cart from '../models/Cart.model';
import { ApiError } from '../utils/ApiError';

export class CouponService {
  /**
   * Validate a coupon against the user's current cart
   */
  static async validateCoupon(
    userId: string,
    code: string,
  ): Promise<{ coupon: ICoupon; discountAmount: number }> {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      throw new ApiError(404, 'Invalid coupon code');
    }

    if (!coupon.active) {
      throw new ApiError(400, 'This coupon is no longer active');
    }

    if (new Date() > coupon.expiryDate) {
      throw new ApiError(400, 'This coupon has expired');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new ApiError(400, 'This coupon has reached its usage limit');
    }

    const cart = await Cart.findOne({ customer: userId });
    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, 'Cart is empty. Cannot apply coupon.');
    }

    if (cart.subtotal < coupon.minimumOrder) {
      throw new ApiError(
        400,
        `Minimum order amount of $${coupon.minimumOrder} not met to use this coupon`,
      );
    }

    // Calculate the potential discount
    let discountAmount = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discountAmount = (cart.subtotal * coupon.value) / 100;
    } else if (coupon.discountType === DiscountType.FIXED) {
      discountAmount = coupon.value;
    }

    // Don't let discount exceed subtotal
    if (discountAmount > cart.subtotal) {
      discountAmount = cart.subtotal;
    }

    return { coupon, discountAmount };
  }
}
