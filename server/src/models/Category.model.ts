import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  active: boolean;
  featured: boolean;
  parentCategory?: Types.ObjectId;
  isDeleted: boolean; // Soft delete
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
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
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    active: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // Don't return by default
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ active: 1, isDeleted: 1 });
CategorySchema.index({ featured: 1 });
CategorySchema.index({ parentCategory: 1 });

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
