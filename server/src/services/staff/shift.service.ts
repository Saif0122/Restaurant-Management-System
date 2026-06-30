import Shift, { ShiftStatus, IShift } from '../../models/Shift.model';
import { ApiError } from '../../utils/ApiError';

export class ShiftService {
  /**
   * Start a new shift for the user
   */
  static async startShift(userId: string, notes?: string): Promise<IShift> {
    // Check if user already has an active shift
    const activeShift = await Shift.findOne({ user: userId, status: ShiftStatus.ACTIVE });
    if (activeShift) {
      throw new ApiError(400, 'User already has an active shift');
    }

    const shift = new Shift({
      user: userId,
      startTime: new Date(),
      status: ShiftStatus.ACTIVE,
      notes,
    });

    await shift.save();
    return shift;
  }

  /**
   * End the user's active shift
   */
  static async endShift(userId: string, notes?: string): Promise<IShift> {
    const shift = await Shift.findOne({ user: userId, status: ShiftStatus.ACTIVE });

    if (!shift) {
      throw new ApiError(404, 'No active shift found to end');
    }

    shift.status = ShiftStatus.COMPLETED;
    shift.endTime = new Date();

    if (notes) {
      // Append or replace notes
      shift.notes = shift.notes ? `${shift.notes}\n${notes}` : notes;
    }

    await shift.save();
    return shift;
  }

  /**
   * Get shift history for a user
   */
  static async getShiftHistory(userId: string, query: any): Promise<IShift[]> {
    const { limit = 20, page = 1 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    return Shift.find({ user: userId }).sort({ startTime: -1 }).skip(skip).limit(Number(limit));
  }
}
