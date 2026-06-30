import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { ReservationManagementService } from '../../services/staff/reservation.service';
import { ReservationStatus } from '../../models/Reservation.model';

export const getAllReservations = asyncHandler(async (req: Request, res: Response) => {
  const result = await ReservationManagementService.getAllReservations(req.query);
  res.status(200).json(new ApiResponse(200, 'Reservations retrieved successfully', result));
});

export const approveReservation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const reservation = await ReservationManagementService.updateStatus(
    id,
    ReservationStatus.CONFIRMED,
  );
  res.status(200).json(new ApiResponse(200, 'Reservation approved successfully', reservation));
});

export const rejectReservation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const reservation = await ReservationManagementService.updateStatus(
    id,
    ReservationStatus.CANCELLED,
  );
  res.status(200).json(new ApiResponse(200, 'Reservation rejected successfully', reservation));
});

export const markArrived = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const reservation = await ReservationManagementService.updateStatus(
    id,
    ReservationStatus.ARRIVED,
  );
  res.status(200).json(new ApiResponse(200, 'Reservation marked as arrived', reservation));
});

export const markCompleted = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const reservation = await ReservationManagementService.updateStatus(
    id,
    ReservationStatus.COMPLETED,
  );
  res.status(200).json(new ApiResponse(200, 'Reservation marked as completed', reservation));
});

export const assignTable = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tableNumber } = req.body;
  const reservation = await ReservationManagementService.assignTable(id, tableNumber);
  res.status(200).json(new ApiResponse(200, 'Table assigned successfully', reservation));
});
