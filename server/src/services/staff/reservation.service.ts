import Reservation, { ReservationStatus, IReservation } from '../../models/Reservation.model';
import { ApiError } from '../../utils/ApiError';

export class ReservationManagementService {
  /**
   * Get all reservations with optional filters
   */
  static async getAllReservations(
    query: any,
  ): Promise<{ reservations: IReservation[]; total: number }> {
    const { status, date, page = 1, limit = 10, search } = query;
    const filter: any = {};

    if (status) {
      filter.status = status;
    }
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.reservationDate = { $gte: startDate, $lte: endDate };
    }

    if (search) {
      // Find reservations by customer name requires lookup or just filtering locally if populated
      // Since it's an object id, basic search needs to be implemented properly, maybe by tableNumber
      filter.tableNumber = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [reservations, total] = await Promise.all([
      Reservation.find(filter)
        .populate('customer', 'fullName email phone')
        .sort({ reservationDate: 1, reservationTime: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Reservation.countDocuments(filter),
    ]);

    return { reservations, total };
  }

  /**
   * Update reservation status (Approve, Reject, Arrived, Completed)
   */
  static async updateStatus(
    reservationId: string,
    status: ReservationStatus,
  ): Promise<IReservation> {
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { status },
      { new: true, runValidators: true },
    ).populate('customer', 'fullName email phone');

    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    return reservation;
  }

  /**
   * Assign a table to a reservation
   */
  static async assignTable(reservationId: string, tableNumber: string): Promise<IReservation> {
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { tableNumber },
      { new: true, runValidators: true },
    );

    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    return reservation;
  }
}
