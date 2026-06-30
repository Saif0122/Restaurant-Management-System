import Order, { OrderStatus, IOrder } from '../../models/Order.model';
import { ApiError } from '../../utils/ApiError';

export class DeliveryService {
  /**
   * Get all active deliveries (ready, preparing or out for delivery, but not delivered or cancelled)
   */
  static async getDeliveries(query: any): Promise<IOrder[]> {
    const { status, limit = 20, page = 1 } = query;
    const filter: any = {
      orderStatus: {
        $in: [OrderStatus.READY, OrderStatus.OUT_FOR_DELIVERY],
      },
      deliveryAddress: { $exists: true }, // Ensure it's a delivery order
    };

    if (status) {
      filter.orderStatus = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    return Order.find(filter)
      .populate('customer', 'fullName phone')
      .populate('deliveryAddress')
      .populate('rider', 'fullName phone')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit));
  }

  /**
   * Assign a rider to an order
   */
  static async assignRider(orderId: string, riderId: string): Promise<IOrder> {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { rider: riderId },
      { new: true, runValidators: true },
    );
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  }

  /**
   * Accept a delivery (Rider action)
   */
  static async acceptDelivery(orderId: string, riderId: string): Promise<IOrder> {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, orderStatus: OrderStatus.READY, rider: { $exists: false } },
      { rider: riderId },
      { new: true },
    );

    if (!order) {
      throw new ApiError(400, 'Order not available for delivery or already assigned');
    }
    return order;
  }

  /**
   * Mark order as Out for Delivery
   */
  static async markOutForDelivery(orderId: string, riderId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: orderId, rider: riderId });

    if (!order) {
      throw new ApiError(404, 'Order not found or not assigned to you');
    }

    order.orderStatus = OrderStatus.OUT_FOR_DELIVERY;
    order.statusHistory.push({
      status: OrderStatus.OUT_FOR_DELIVERY,
      updatedAt: new Date(),
    });

    await order.save();
    return order;
  }

  /**
   * Mark order as Delivered
   */
  static async markDelivered(orderId: string, riderId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: orderId, rider: riderId });

    if (!order) {
      throw new ApiError(404, 'Order not found or not assigned to you');
    }

    order.orderStatus = OrderStatus.DELIVERED;
    order.statusHistory.push({
      status: OrderStatus.DELIVERED,
      updatedAt: new Date(),
    });

    await order.save();
    return order;
  }

  /**
   * Get delivery history for a specific rider
   */
  static async getDeliveryHistory(riderId: string, query: any): Promise<IOrder[]> {
    const { limit = 20, page = 1 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    return Order.find({
      rider: riderId,
      orderStatus: OrderStatus.DELIVERED,
    })
      .populate('customer', 'fullName')
      .populate('deliveryAddress')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit));
  }
}
