import Review, { IReview } from '../models/Review.model';
import Order, { OrderStatus } from '../models/Order.model';
import Food from '../models/Food.model';
import { ApiError } from '../utils/ApiError';

export class ReviewService {
  /**
   * Create a review for a food item
   */
  static async createReview(
    userId: string,
    data: { foodId: string; rating: number; review: string; images?: string[] },
  ): Promise<IReview> {
    const { foodId, rating, review, images } = data;

    const food = await Food.findById(foodId);
    if (!food) {
      throw new ApiError(404, 'Food item not found');
    }

    // Verify purchase
    const hasPurchased = await Order.findOne({
      customer: userId,
      'items.food': foodId,
      orderStatus: OrderStatus.DELIVERED,
    });

    if (!hasPurchased) {
      throw new ApiError(403, 'You can only review items you have purchased and received');
    }

    const existingReview = await Review.findOne({ customer: userId, food: foodId });
    if (existingReview) {
      throw new ApiError(400, 'You have already reviewed this item');
    }

    const newReview = await Review.create({
      customer: userId,
      food: foodId,
      rating,
      review,
      images: images || [],
      verifiedPurchase: true,
    });

    return newReview.populate('customer', 'fullName avatar');
  }

  /**
   * List reviews for a specific food item
   */
  static async getFoodReviews(foodId: string): Promise<IReview[]> {
    return Review.find({ food: foodId })
      .sort({ createdAt: -1 })
      .populate('customer', 'fullName avatar');
  }

  /**
   * Update a review
   */
  static async updateReview(
    userId: string,
    reviewId: string,
    data: { rating?: number; review?: string; images?: string[] },
  ): Promise<IReview> {
    const review = await Review.findOne({ _id: reviewId, customer: userId });

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (data.rating) {
      review.rating = data.rating;
    }
    if (data.review) {
      review.review = data.review;
    }
    if (data.images) {
      review.images = data.images;
    }

    await review.save();

    return review.populate('customer', 'fullName avatar');
  }

  /**
   * Delete a review
   */
  static async deleteReview(userId: string, reviewId: string): Promise<void> {
    const review = await Review.findOne({ _id: reviewId, customer: userId });

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    // Use deleteOne so that any pre/post remove hooks trigger properly if they exist (though we use Post-save right now. Wait, calcAverageRatings needs to run on delete as well).
    // Actually in Review.model.ts, the hook might be only on 'save'. Let me check.
    // If the hook is missing on remove, we can manually call calcAverageRatings.
    await review.deleteOne();

    // Manually trigger calcAverageRatings since remove hook might be tricky with Mongoose 6+ deleteOne
    await Review.calcAverageRatings(review.food);
  }
}
