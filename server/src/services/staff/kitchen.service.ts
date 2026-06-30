import Order, { OrderStatus, IOrder } from '../../models/Order.model';
import { ApiError } from '../../utils/ApiError';

export class KitchenService {
  /**
   * Get all pending orders that need to be prepared
   */
  static async getPendingOrders(): Promise<IOrder[]> {
    return Order.find({ orderStatus: OrderStatus.CONFIRMED })
      .populate('items.food', 'name image preparationTime spiceLevel')
      .sort({ createdAt: 1 });
  }

  /**
   * Get all orders currently being prepared
   */
  static async getPreparingOrders(): Promise<IOrder[]> {
    return Order.find({ orderStatus: OrderStatus.PREPARING })
      .populate('items.food', 'name image preparationTime spiceLevel')
      .sort({ updatedAt: 1 });
  }

  /**
   * Get all ready orders
   */
  static async getReadyOrders(): Promise<IOrder[]> {
    return Order.find({ orderStatus: OrderStatus.READY })
      .populate('items.food', 'name image preparationTime spiceLevel')
      .sort({ updatedAt: -1 });
  }

  /**
   * Get basic kitchen statistics
   */
  static async getKitchenStats(): Promise<any> {
    const pendingCount = await Order.countDocuments({ orderStatus: OrderStatus.CONFIRMED });
    const preparingCount = await Order.countDocuments({ orderStatus: OrderStatus.PREPARING });
    const readyCount = await Order.countDocuments({ orderStatus: OrderStatus.READY });

    return {
      pending: pendingCount,
      preparing: preparingCount,
      ready: readyCount,
    };
  }

  /**
   * Update the status of an order
   */
  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Optionally add validation to ensure correct status transitions
    // E.g. CONFIRMED -> PREPARING -> READY

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      updatedAt: new Date(),
    });

    await order.save();
    return order;
  }

  /**
   * Update kitchen notes for an order
   */
  static async updateKitchenNotes(orderId: string, notes: string): Promise<IOrder> {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { kitchenNotes: notes },
      { new: true, runValidators: true },
    );
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  }

  /**
   * Update estimated preparation time for an order
   */
  static async updateEstimatedPrepTime(orderId: string, minutes: number): Promise<IOrder> {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { estimatedPrepTime: minutes },
      { new: true, runValidators: true },
    );
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  }
}
