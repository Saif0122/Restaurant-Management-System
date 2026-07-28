import Order, { OrderStatus } from '../../models/Order.model';
import { ApiError } from '../../utils/ApiError';
type FilterQuery<T = any> = Record<string, T | any>;

class OrderService {
  public async getOrders(options: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
    date?: string;
  }) {
    const { page, limit, status, search, date } = options;
    const skip = (page - 1) * limit;

    const query: FilterQuery<any> = {};

    if (status) {
      query.orderStatus = status;
    }
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('customer', 'fullName email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getOrderById(id: string) {
    const order = await Order.findById(id)
      .populate('customer', 'fullName email phone')
      .populate('items.food', 'name images price');
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  }

  public async updateStatus(id: string, status: OrderStatus, note?: string) {
    const order = await Order.findById(id);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      note,
      updatedAt: new Date(),
    });

    await order.save();
    return order;
  }

  // A method for generating timeline info isn't strictly necessary since statusHistory is already an array in the model.
  // The client can just use statusHistory. We can expose an endpoint just for clarity if needed.
  public async getOrderTimeline(id: string) {
    const order = await Order.findById(id).select('statusHistory orderStatus orderNumber');
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  }
}

export default new OrderService();
