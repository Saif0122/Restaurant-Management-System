import Favorite, { IFavorite } from '../models/Favorite.model';
import Food from '../models/Food.model';
import { ApiError } from '../utils/ApiError';

export class FavoriteService {
  /**
   * Get all favorites for a user
   */
  static async getFavorites(userId: string): Promise<IFavorite[]> {
    return Favorite.find({ customer: userId })
      .populate('food', 'name description price image category availability averageRating')
      .sort({ createdAt: -1 });
  }

  /**
   * Add a food item to favorites
   */
  static async addFavorite(userId: string, foodId: string): Promise<IFavorite> {
    const food = await Food.findById(foodId);
    if (!food) {
      throw new ApiError(404, 'Food item not found');
    }

    const existingFavorite = await Favorite.findOne({ customer: userId, food: foodId });
    if (existingFavorite) {
      throw new ApiError(400, 'Food item is already in favorites');
    }

    const favorite = await Favorite.create({
      customer: userId,
      food: foodId,
    });

    return favorite.populate(
      'food',
      'name description price image category availability averageRating',
    );
  }

  /**
   * Remove a food item from favorites
   */
  static async removeFavorite(userId: string, foodId: string): Promise<void> {
    const deletedFavorite = await Favorite.findOneAndDelete({ customer: userId, food: foodId });
    if (!deletedFavorite) {
      throw new ApiError(404, 'Favorite not found');
    }
  }
}
