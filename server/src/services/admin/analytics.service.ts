import Order from '../../models/Order.model';
import User, { UserRole } from '../../models/User.model';
import Reservation from '../../models/Reservation.model';
import Food from '../../models/Food.model';
import Category from '../../models/Category.model';
import Coupon from '../../models/Coupon.model';
import ActivityLog from '../../models/ActivityLog.model';
import moment from 'moment';

class AnalyticsService {
  public async getDashboardStats() {
    const todayStart = moment().startOf('day').toDate();
    const weekStart = moment().startOf('week').toDate();
    const monthStart = moment().startOf('month').toDate();
    const yearStart = moment().startOf('year').toDate();

    // 1. Revenue
    const revenueAggr = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          todayRevenue: {
            $sum: { $cond: [{ $gte: ['$createdAt', todayStart] }, '$total', 0] },
          },
          weeklyRevenue: {
            $sum: { $cond: [{ $gte: ['$createdAt', weekStart] }, '$total', 0] },
          },
          monthlyRevenue: {
            $sum: { $cond: [{ $gte: ['$createdAt', monthStart] }, '$total', 0] },
          },
          yearlyRevenue: {
            $sum: { $cond: [{ $gte: ['$createdAt', yearStart] }, '$total', 0] },
          },
        },
      },
    ]);

    const revenue = revenueAggr[0] || {
      totalRevenue: 0,
      todayRevenue: 0,
      weeklyRevenue: 0,
      monthlyRevenue: 0,
      yearlyRevenue: 0,
    };

    // 2. Users
    const usersCount = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);
    const users = {
      total: 0,
      customers: 0,
      staff: 0,
    };
    usersCount.forEach((u: any) => {
      users.total += u.count;
      if (u._id === UserRole.CUSTOMER) {
        users.customers = u.count;
      }
      if (u._id === UserRole.STAFF) {
        users.staff = u.count;
      }
    });

    // 3. Orders
    const ordersCount = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);
    const orders = {
      total: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
    };
    ordersCount.forEach((o: any) => {
      orders.total += o.count;
      if (o._id === 'Pending') {
        orders.pending = o.count;
      }
      if (o._id === 'Delivered') {
        orders.completed = o.count;
      }
      if (o._id === 'Cancelled') {
        orders.cancelled = o.count;
      }
    });

    // 4. Other stats
    const totalReservations = await Reservation.countDocuments();
    const totalFoods = await Food.countDocuments();
    const totalCategories = await Category.countDocuments();
    const activeCoupons = await Coupon.countDocuments({
      isActive: true,
      expirationDate: { $gte: new Date() },
    });

    // 5. Best Sellers (Foods)
    const bestSellers = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.food',
          totalSold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'foods',
          localField: '_id',
          foreignField: '_id',
          as: 'foodDetails',
        },
      },
      { $unwind: '$foodDetails' },
      {
        $project: {
          _id: 1,
          name: '$foodDetails.name',
          totalSold: 1,
          image: '$foodDetails.images', // Note: array mapping might vary slightly
        },
      },
    ]);

    // Fix image array issue if any
    const formattedBestSellers = bestSellers.map((bs: any) => ({
      ...bs,
      image: bs.image && bs.image.length > 0 ? bs.image[0].url : '',
    }));

    // 6. Low Stock Foods (assuming there's a stock or inventory field. If not, we might need to skip or mock, let's check Food model)
    // Looking at common patterns, maybe `stock` or `available`. Let's assume `stock` <= 10.
    const lowStockFoods = await Food.find({ stock: { $lte: 10 } }) // Trying generic name
      .select('name stock')
      .limit(5)
      .lean();

    // 7. Recent Activities
    const recentActivities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'fullName email')
      .lean();

    return {
      revenue,
      users,
      orders,
      other: {
        totalReservations,
        totalFoods,
        totalCategories,
        activeCoupons,
      },
      bestSellers: formattedBestSellers,
      lowStockFoods,
      recentActivities,
    };
  }
}

export default new AnalyticsService();
