import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ReservationService } from '../services/reservation.service';

export const createReservation = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();

  const reservation = await ReservationService.createReservation(userId, req.body);

  res.status(201).json(new ApiResponse(201, 'Reservation created successfully', reservation));
});

export const getUserReservations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();

  const reservations = await ReservationService.getUserReservations(userId);

  res.status(200).json(new ApiResponse(200, 'Reservations retrieved successfully', reservations));
});

export const cancelReservation = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;

  const reservation = await ReservationService.cancelReservation(userId, id);

  res.status(200).json(new ApiResponse(200, 'Reservation cancelled successfully', reservation));
});

export const updateReservation = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;

  const reservation = await ReservationService.updateReservation(userId, id, req.body);

  res.status(200).json(new ApiResponse(200, 'Reservation updated successfully', reservation));
});
