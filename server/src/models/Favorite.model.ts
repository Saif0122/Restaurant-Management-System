import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFavorite extends Document {
  customer: Types.ObjectId;
  food: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema: Schema = new Schema(
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
  },
  {
    timestamps: true,
  },
);

// Indexes
// Prevent adding the same food twice to wishlist
FavoriteSchema.index({ customer: 1, food: 1 }, { unique: true });
FavoriteSchema.index({ customer: 1 });

const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;
