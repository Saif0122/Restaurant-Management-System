import { Types } from 'mongoose';
import Order, { IOrder, OrderStatus, PaymentStatus } from '../models/Order.model';
import Cart from '../models/Cart.model';
import Coupon, { DiscountType } from '../models/Coupon.model';
import Address from '../models/Address.model';
import Food from '../models/Food.model';
import { ApiError } from '../utils/ApiError';

export class OrderService {
  /**
   * Place a new order from user's cart
   */
  static async placeOrder(
    userId: string,
    data: { deliveryAddressId: string; couponId?: string; notes?: string },
  ): Promise<IOrder> {
    const { deliveryAddressId, couponId, notes } = data;

    // 1. Verify Address
    const address = await Address.findOne({ _id: deliveryAddressId, customer: userId });
    if (!address) {
      throw new ApiError(404, 'Delivery address not found or does not belong to user');
    }

    // 2. Get Cart
    const cart = await Cart.findOne({ customer: userId }).populate('items.food');
    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, 'Cart is empty. Cannot place order.');
    }

    // Validate stock for all items
    for (const item of cart.items) {
      const food = item.food as any;
      if (!food) {
        throw new ApiError(404, 'One or more food items in your cart do not exist');
      }
      if (!food.availability || !food.active || food.isDeleted) {
        throw new ApiError(400, `Food item "${food.name}" is currently unavailable`);
      }
      if (food.stock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for "${food.name}". Available: ${food.stock}, requested: ${item.quantity}`,
        );
      }
    }

    // Deduct stock
    for (const item of cart.items) {
      const food = item.food as any;
      food.stock -= item.quantity;
      await food.save();
    }

    // 3. Calculate initial totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Number((subtotal * 0.1).toFixed(2)); // Flat 10% tax for example
    const deliveryFee = 5.0; // Flat $5 delivery fee
    let discount = 0;

    // 4. Handle Coupon Validation
    let validCouponId: Types.ObjectId | undefined;
    if (couponId) {
      const coupon = await Coupon.findById(couponId);
      if (!coupon) {
        throw new ApiError(404, 'Coupon not found');
      }
      if (!coupon.active || new Date() > coupon.expiryDate) {
        throw new ApiError(400, 'Coupon is inactive or expired');
      }
      if (coupon.usedCount >= coupon.usageLimit) {
        throw new ApiError(400, 'Coupon usage limit reached');
      }
      if (subtotal < coupon.minimumOrder) {
        throw new ApiError(
          400,
          `Minimum order amount of $${coupon.minimumOrder} not met for this coupon`,
        );
      }

      // Calculate discount
      if (coupon.discountType === DiscountType.PERCENTAGE) {
        discount = (subtotal * coupon.value) / 100;
      } else if (coupon.discountType === DiscountType.FIXED) {
        discount = coupon.value;
      }

      // Ensure discount doesn't exceed subtotal
      if (discount > subtotal) {
        discount = subtotal;
      }

      validCouponId = new Types.ObjectId(couponId);

      // Increment coupon usage
      coupon.usedCount += 1;
      await coupon.save();
    }

    // 5. Final totals
    const total = subtotal + tax + deliveryFee - discount;

    // 6. Generate Order Number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 7. Create Order
    const orderItems = cart.items.map((item) => ({
      food: item.food._id,
      quantity: item.quantity,
      price: item.price,
      specialInstructions: item.specialInstructions,
    }));

    const order = await Order.create({
      orderNumber,
      customer: userId,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      discount,
      total,
      coupon: validCouponId,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
      statusHistory: [
        {
          status: OrderStatus.PENDING,
          note: 'Order placed successfully',
          updatedAt: new Date(),
        },
      ],
      deliveryAddress: deliveryAddressId,
      notes,
    });

    // 8. Clear Cart
    cart.items = [];
    cart.subtotal = 0;
    cart.total = 0;
    await cart.save();

    return order.populate('items.food', 'name image price');
  }

  /**
   * Get user's order history
   */
  static async getOrderHistory(userId: string): Promise<IOrder[]> {
    return Order.find({ customer: userId })
      .sort({ createdAt: -1 })
      .populate('items.food', 'name image');
  }

  /**
   * Get specific order details
   */
  static async getOrderById(userId: string, orderId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: orderId, customer: userId })
      .populate('items.food', 'name image')
      .populate('deliveryAddress')
      .populate('coupon', 'code discountType value');

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  }

  /**
   * Cancel an order
   */
  static async cancelOrder(userId: string, orderId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: orderId, customer: userId });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (order.orderStatus !== OrderStatus.PENDING) {
      throw new ApiError(400, 'Only pending orders can be cancelled');
    }

    // Restore stock
    for (const item of order.items) {
      await Food.findByIdAndUpdate(item.food, {
        $inc: { stock: item.quantity },
      });
    }

    order.orderStatus = OrderStatus.CANCELLED;
    order.statusHistory.push({
      status: OrderStatus.CANCELLED,
      note: 'Order cancelled by customer',
      updatedAt: new Date(),
    });

    await order.save();

    return order.populate('items.food', 'name image');
  }
}
