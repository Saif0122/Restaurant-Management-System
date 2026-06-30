import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { ShiftService } from '../../services/staff/shift.service';

export const startShift = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const shift = await ShiftService.startShift(userId, req.body.notes);
  res.status(201).json(new ApiResponse(201, 'Shift started successfully', shift));
});

export const endShift = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const shift = await ShiftService.endShift(userId, req.body.notes);
  res.status(200).json(new ApiResponse(200, 'Shift ended successfully', shift));
});

export const getShiftHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const history = await ShiftService.getShiftHistory(userId, req.query);
  res.status(200).json(new ApiResponse(200, 'Shift history retrieved successfully', history));
});
