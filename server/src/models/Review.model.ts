import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  customer: Types.ObjectId;
  food: Types.ObjectId;
  rating: number;
  review: string;
  images: string[];
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    food: {
      type: Schema.Types.ObjectId,
      ref: 'Food',
      required: [true, 'Food item is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    images: [
      {
        type: String,
      },
    ],
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
// Prevent a user from reviewing the same food twice
ReviewSchema.index({ customer: 1, food: 1 }, { unique: true });
ReviewSchema.index({ food: 1 });
ReviewSchema.index({ rating: -1 });

// Post-save and Post-remove hooks to calculate average rating on Food
ReviewSchema.post<IReview>('save', async function () {
  await (this.constructor as any).calcAverageRatings(this.food);
});

ReviewSchema.statics.calcAverageRatings = async function (foodId: Types.ObjectId) {
  const stats = await this.aggregate([
    {
      $match: { food: foodId },
    },
    {
      $group: {
        _id: '$food',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Food').findByIdAndUpdate(foodId, {
      totalReviews: stats[0].nRating,
      averageRating: stats[0].avgRating,
    });
  } else {
    await mongoose.model('Food').findByIdAndUpdate(foodId, {
      totalReviews: 0,
      averageRating: 0,
    });
  }
};

const Review = mongoose.model<IReview, any>('Review', ReviewSchema);

export default Review;
