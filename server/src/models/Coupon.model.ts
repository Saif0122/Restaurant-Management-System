import mongoose, { Document, Schema } from 'mongoose';

export enum DiscountType {
  PERCENTAGE = 'Percentage',
  FIXED = 'Fixed',
}

export interface ICoupon extends Document {
  code: string;
  discountType: DiscountType;
  value: number; // The discount value (e.g., 10 for 10% or $10)
  minimumOrder: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: Object.values(DiscountType),
      required: [true, 'Discount type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    minimumOrder: {
      type: Number,
      default: 0,
      min: [0, 'Minimum order cannot be negative'],
    },
    usageLimit: {
      type: Number,
      default: 100, // Arbitrary default limit
      min: [1, 'Usage limit must be at least 1'],
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
CouponSchema.index({ code: 1 });
CouponSchema.index({ active: 1, expiryDate: 1 });

const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
