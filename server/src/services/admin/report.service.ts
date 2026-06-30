import Order from '../../../models/Order.model';
import User from '../../../models/User.model';
import Reservation from '../../../models/Reservation.model';
import Food from '../../../models/Food.model';
import { FilterQuery } from 'mongoose';

class ReportService {
  private getDateFilter(startDate?: string, endDate?: string) {
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }
    return filter;
  }

  public async getSalesReport(startDate?: string, endDate?: string) {
    const filter = this.getDateFilter(startDate, endDate);
    filter.paymentStatus = 'Paid';

    // Detailed sales data
    const orders = await Order.find(filter)
      .populate('customer', 'fullName email')
      .populate('items.food', 'name category')
      .sort({ createdAt: -1 })
      .lean();

    return orders;
  }

  public async getRevenueReport(startDate?: string, endDate?: string) {
    const filter = this.getDateFilter(startDate, endDate);
    filter.paymentStatus = 'Paid';

    // Group by day
    const revenueAggr = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    return revenueAggr.map((item) => ({
      date: item._id,
      revenue: item.totalRevenue,
      ordersCount: item.totalOrders,
    }));
  }

  public async getCustomerReport(startDate?: string, endDate?: string) {
    const filter = this.getDateFilter(startDate, endDate);
    filter.role = 'Customer';

    const customers = await User.find(filter)
      .select('fullName email phone createdAt isActive isVerified')
      .sort({ createdAt: -1 })
      .lean();

    return customers;
  }

  public async getFoodReport() {
    // Inventory and active status report
    const foods = await Food.find()
      .populate('category', 'name')
      .select('name stock price availability active isDeleted')
      .lean();

    return foods;
  }

  public async getReservationReport(startDate?: string, endDate?: string) {
    // Use reservationDate for filter instead of createdAt
    const filter: any = {};
    if (startDate || endDate) {
      filter.reservationDate = {};
      if (startDate) {
        filter.reservationDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.reservationDate.$lte = end;
      }
    }

    const reservations = await Reservation.find(filter)
      .populate('customer', 'fullName')
      .sort({ reservationDate: -1 })
      .lean();

    return reservations;
  }
}

export default new ReportService();
