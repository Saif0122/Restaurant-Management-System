import Food, { IFood } from '../../models/Food.model';
import RestockRequest, { IRestockRequest } from '../../models/RestockRequest.model';

export class InventoryService {
  /**
   * Get all food items with low stock (e.g. less than 10)
   */
  static async getLowStockAlerts(threshold: number = 10): Promise<IFood[]> {
    return Food.find({ stock: { $gt: 0, $lte: threshold }, isDeleted: false })
      .select('name image stock category')
      .sort({ stock: 1 });
  }

  /**
   * Get all out-of-stock items
   */
  static async getOutOfStockAlerts(): Promise<IFood[]> {
    return Food.find({ stock: 0, isDeleted: false })
      .select('name image stock category')
      .sort({ name: 1 });
  }

  /**
   * Create a restock request for a specific food item
   */
  static async createRestockRequest(
    userId: string,
    data: { foodId: string; quantity: number; notes?: string },
  ): Promise<IRestockRequest> {
    const request = new RestockRequest({
      food: data.foodId,
      requestedBy: userId,
      quantity: data.quantity,
      notes: data.notes,
    });

    await request.save();
    return request.populate('food', 'name');
  }

  /**
   * Get all restock requests
   */
  static async getRestockRequests(): Promise<IRestockRequest[]> {
    return RestockRequest.find()
      .populate('food', 'name')
      .populate('requestedBy', 'fullName')
      .sort({ createdAt: -1 });
  }
}
