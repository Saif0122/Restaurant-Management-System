import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import reservationService from '../../services/admin/reservation.service';
import { ReservationStatus } from '../../models/Reservation.model';

class ReservationController {
  public getReservations = asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', limit = '10', status, search, date } = req.query;
    const result = await reservationService.getReservations({
      page: Number(page),
      limit: Number(limit),
      status: status as string,
      search: search as string,
      date: date as string,
    });
    res.status(200).json(new ApiResponse(200, result, 'Reservations retrieved successfully'));
  });

  public getReservationById = asyncHandler(async (req: Request, res: Response) => {
    const reservation = await reservationService.getReservationById(req.params.id);
    res.status(200).json(new ApiResponse(200, reservation, 'Reservation retrieved successfully'));
  });

  public updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status, tableNumber } = req.body;
    const reservation = await reservationService.updateStatus(
      req.params.id,
      status as ReservationStatus,
      tableNumber,
    );
    res
      .status(200)
      .json(new ApiResponse(200, reservation, 'Reservation status updated successfully'));
  });

  public assignTable = asyncHandler(async (req: Request, res: Response) => {
    const { tableNumber } = req.body;
    const reservation = await reservationService.assignTable(req.params.id, tableNumber);
    res.status(200).json(new ApiResponse(200, reservation, 'Table assigned successfully'));
  });
}

export default new ReservationController();
