import Reservation, { ReservationStatus } from '../../models/Reservation.model';
import { ApiError } from '../../utils/ApiError';
type FilterQuery<T = any> = Record<string, T | any>;

class ReservationService {
  public async getReservations(options: {
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
      query.status = status;
    }
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.reservationDate = { $gte: start, $lte: end };
    }

    // Need a way to search by customer name if needed. Typically requires $lookup or similar.
    // For simplicity, we just filter by customer directly if search string is a valid objectId or rely on lookup
    if (search) {
      // If we want to search by customer name, we should use aggregation or populate and filter
      // Alternatively, we just won't search customer name here, or we do a lookup.
      // We'll skip complex search for now or just search by table number or notes.
      query.tableNumber = { $regex: search, $options: 'i' };
    }

    const [reservations, total] = await Promise.all([
      Reservation.find(query)
        .populate('customer', 'fullName email phone')
        .sort({ reservationDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Reservation.countDocuments(query),
    ]);

    return {
      reservations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getReservationById(id: string) {
    const reservation = await Reservation.findById(id).populate('customer', 'fullName email phone');
    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }
    return reservation;
  }

  public async updateStatus(id: string, status: ReservationStatus, tableNumber?: string) {
    const updateData: any = { status };
    if (tableNumber !== undefined) {
      updateData.tableNumber = tableNumber;
    }

    const reservation = await Reservation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('customer', 'fullName email phone');
    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }
    return reservation;
  }

  public async assignTable(id: string, tableNumber: string) {
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { tableNumber },
      { new: true },
    ).populate('customer', 'fullName email phone');
    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }
    return reservation;
  }
}

export default new ReservationService();
