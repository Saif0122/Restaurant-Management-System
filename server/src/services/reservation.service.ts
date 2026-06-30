import Reservation, { IReservation, ReservationStatus } from '../models/Reservation.model';
import { ApiError } from '../utils/ApiError';

export class ReservationService {
  /**
   * Create a new reservation
   */
  static async createReservation(
    userId: string,
    data: {
      reservationDate: Date;
      reservationTime: string;
      guestCount: number;
      tableNumber?: string;
      occasion?: string;
      specialRequest?: string;
    },
  ): Promise<IReservation> {
    const { reservationDate, reservationTime, guestCount, tableNumber, occasion, specialRequest } =
      data;

    // Convert input date string to a Date object at midnight for comparison
    const targetDate = new Date(reservationDate);
    targetDate.setHours(0, 0, 0, 0);

    // Prevent past date reservations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      throw new ApiError(400, 'Cannot make a reservation in the past');
    }

    // Check for double booking by the same user on the same date
    const startOfDay = new Date(targetDate);
    const endOfDay = new Date(targetDate);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const existingReservation = await Reservation.findOne({
      customer: userId,
      reservationDate: { $gte: startOfDay, $lt: endOfDay },
      status: { $in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
    });

    if (existingReservation) {
      throw new ApiError(400, 'You already have a reservation on this date');
    }

    const reservation = await Reservation.create({
      customer: userId,
      reservationDate: targetDate, // Store as midnight to standardize
      reservationTime,
      guestCount,
      tableNumber,
      occasion,
      specialRequest,
      status: ReservationStatus.PENDING,
    });

    return reservation;
  }

  /**
   * Get all reservations for a user
   */
  static async getUserReservations(userId: string): Promise<IReservation[]> {
    return Reservation.find({ customer: userId }).sort({
      reservationDate: -1,
      reservationTime: -1,
    });
  }

  /**
   * Cancel a reservation
   */
  static async cancelReservation(userId: string, reservationId: string): Promise<IReservation> {
    const reservation = await Reservation.findOne({ _id: reservationId, customer: userId });

    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    if (
      reservation.status !== ReservationStatus.PENDING &&
      reservation.status !== ReservationStatus.CONFIRMED
    ) {
      throw new ApiError(400, `Cannot cancel reservation in ${reservation.status} status`);
    }

    reservation.status = ReservationStatus.CANCELLED;
    await reservation.save();

    return reservation;
  }

  /**
   * Update a reservation
   */
  static async updateReservation(
    userId: string,
    reservationId: string,
    data: {
      reservationDate?: Date;
      reservationTime?: string;
      guestCount?: number;
      occasion?: string;
      specialRequest?: string;
    },
  ): Promise<IReservation> {
    const reservation = await Reservation.findOne({ _id: reservationId, customer: userId });
    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    if (
      reservation.status !== ReservationStatus.PENDING &&
      reservation.status !== ReservationStatus.CONFIRMED
    ) {
      throw new ApiError(400, `Cannot update reservation in ${reservation.status} status`);
    }

    const newDate = data.reservationDate
      ? new Date(data.reservationDate)
      : reservation.reservationDate;
    newDate.setHours(0, 0, 0, 0);
    const newTime = data.reservationTime || reservation.reservationTime;

    if (data.reservationDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (newDate < today) {
        throw new ApiError(400, 'Cannot make a reservation in the past');
      }
    }

    if (data.reservationDate || data.reservationTime) {
      const startOfDay = new Date(newDate);
      const endOfDay = new Date(newDate);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const existingReservation = await Reservation.findOne({
        _id: { $ne: reservationId },
        customer: userId,
        reservationDate: { $gte: startOfDay, $lt: endOfDay },
        status: { $in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
      });

      if (existingReservation) {
        throw new ApiError(400, 'You already have another reservation on this date');
      }
    }

    if (data.reservationDate) {
      reservation.reservationDate = newDate;
    }
    if (data.reservationTime) {
      reservation.reservationTime = newTime;
    }
    if (data.guestCount !== undefined) {
      reservation.guestCount = data.guestCount;
    }
    if (data.occasion !== undefined) {
      reservation.occasion = data.occasion;
    }
    if (data.specialRequest !== undefined) {
      reservation.specialRequest = data.specialRequest;
    }

    await reservation.save();
    return reservation;
  }
}
