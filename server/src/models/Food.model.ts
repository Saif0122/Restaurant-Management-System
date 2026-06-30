import mongoose, { Document, Schema, Types } from 'mongoose';

export enum SpiceLevel {
  NONE = 'None',
  MILD = 'Mild',
  MEDIUM = 'Medium',
  HOT = 'Hot',
  EXTRA_HOT = 'Extra Hot',
}

export interface IFood extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Types.ObjectId;
  images: string[];
  ingredients: string[];
  dietaryTags: string[];
  allergens: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  availability: boolean;
  preparationTime: number; // in minutes
  calories?: number;
  spiceLevel: SpiceLevel;
  averageRating: number;
  totalReviews: number;
  featured: boolean;
  isTodaysSpecial: boolean;
  active: boolean;
  isDeleted: boolean; // Soft delete
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [150, 'Short description cannot exceed 150 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    images: [
      {
        type: String,
        required: [true, 'At least one image is required'],
      },
    ],
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
    dietaryTags: [
      {
        type: String,
        trim: true,
      },
    ],
    allergens: [
      {
        type: String,
        trim: true,
      },
    ],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price must be a positive number'],
      validate: {
        validator: function (this: IFood, value: number) {
          return !value || value < this.price;
        },
        message: 'Discount price must be lower than regular price',
      },
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number,
      required: [true, 'Preparation time is required (in minutes)'],
      min: [1, 'Preparation time must be at least 1 minute'],
    },
    calories: {
      type: Number,
      min: [0, 'Calories cannot be negative'],
    },
    spiceLevel: {
      type: String,
      enum: Object.values(SpiceLevel),
      default: SpiceLevel.NONE,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isTodaysSpecial: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
FoodSchema.index({ slug: 1 });
FoodSchema.index({ category: 1 });
FoodSchema.index({ active: 1, isDeleted: 1 });
FoodSchema.index({ price: 1 });
FoodSchema.index({ averageRating: -1 });
// Text index for search functionality
FoodSchema.index({ name: 'text', description: 'text', dietaryTags: 'text' });

const Food = mongoose.model<IFood>('Food', FoodSchema);

export default Food;
