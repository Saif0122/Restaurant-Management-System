import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICartItem {
  food: Types.ObjectId;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface ICart extends Document {
  customer: Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    food: {
      type: Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number'],
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [200, 'Special instructions cannot exceed 200 characters'],
    },
  },
  { _id: false }, // Avoid generating a separate _id for each item in the array
);

const CartSchema: Schema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
      unique: true, // A user should have only one active cart
    },
    items: [CartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to calculate totals
CartSchema.pre('save', function (this: any, next: any) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );
    this.total = this.subtotal; // Further calculations like taxes or discounts can be added here
  } else {
    this.subtotal = 0;
    this.total = 0;
  }
  next();
});

// Indexes
CartSchema.index({ customer: 1 });

const Cart = mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
