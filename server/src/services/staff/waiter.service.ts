import Order, { OrderStatus, IOrder } from '../../models/Order.model';
import { ApiError } from '../../utils/ApiError';

export class WaiterService {
  /**
   * Get all active dine-in orders
   */
  static async getDineInOrders(): Promise<IOrder[]> {
    return Order.find({
      tableNumber: { $exists: true, $ne: null },
      orderStatus: {
        $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY],
      },
    })
      .populate('items.food', 'name image price')
      .sort({ updatedAt: -1 });
  }

  /**
   * Get all active tables (tables currently occupied/having active orders)
   */
  static async getActiveTables(): Promise<string[]> {
    const orders = await Order.find({
      tableNumber: { $exists: true, $ne: null },
      orderStatus: {
        $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY],
      },
    }).select('tableNumber -_id');

    const tables = new Set(orders.map((o) => o.tableNumber as string));
    return Array.from(tables);
  }

  /**
   * Assign table to an order
   */
  static async assignTableToOrder(orderId: string, tableNumber: string): Promise<IOrder> {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { tableNumber },
      { new: true, runValidators: true },
    );
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  }

  /**
   * Add order notes (Waiter taking special requests)
   */
  static async addOrderNotes(orderId: string, notes: string): Promise<IOrder> {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { notes },
      { new: true, runValidators: true },
    );
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  }

  /**
   * Complete dine-in order
   */
  static async completeOrder(orderId: string): Promise<IOrder> {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, tableNumber: { $exists: true } },
      {
        orderStatus: OrderStatus.DELIVERED, // Using DELIVERED as completed for dine-in
      },
      { new: true },
    );

    if (!order) {
      throw new ApiError(404, 'Dine-in order not found');
    }

    order.statusHistory.push({
      status: OrderStatus.DELIVERED,
      updatedAt: new Date(),
    });

    await order.save();
    return order;
  }
}
