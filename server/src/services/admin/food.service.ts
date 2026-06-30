import Food from '../../../models/Food.model';
import { ApiError } from '../../../utils/ApiError';

class FoodService {
  public async bulkUpdate(foodIds: string[], updateData: any) {
    const result = await Food.updateMany({ _id: { $in: foodIds } }, { $set: updateData });
    return result;
  }

  public async bulkAction(foodIds: string[], action: 'activate' | 'deactivate' | 'delete') {
    let updateQuery = {};
    if (action === 'activate') {
      updateQuery = { active: true };
    } else if (action === 'deactivate') {
      updateQuery = { active: false };
    } else if (action === 'delete') {
      updateQuery = { isDeleted: true, active: false };
    }

    const result = await Food.updateMany({ _id: { $in: foodIds } }, { $set: updateQuery });
    return result;
  }

  public async adjustInventory(
    id: string,
    quantity: number,
    operation: 'set' | 'add' | 'subtract',
  ) {
    const food = await Food.findById(id);
    if (!food) {
      throw new ApiError(404, 'Food not found');
    }

    if (operation === 'set') {
      food.stock = quantity;
    } else if (operation === 'add') {
      food.stock += quantity;
    } else if (operation === 'subtract') {
      food.stock = Math.max(0, food.stock - quantity);
    }

    // Automatically manage availability based on stock
    if (food.stock === 0) {
      food.availability = false;
    } else if (!food.availability && food.stock > 0) {
      food.availability = true;
    }

    await food.save();
    return food;
  }

  public async toggleFlags(id: string, flags: { isFeatured?: boolean; isTodaysSpecial?: boolean }) {
    const food = await Food.findById(id);
    if (!food) {
      throw new ApiError(404, 'Food not found');
    }

    if (flags.isFeatured !== undefined) {
      food.featured = flags.isFeatured;
    }
    if (flags.isTodaysSpecial !== undefined) {
      food.isTodaysSpecial = flags.isTodaysSpecial;
    }

    await food.save();
    return food;
  }
}

export default new FoodService();
