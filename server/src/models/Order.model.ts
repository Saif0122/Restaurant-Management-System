import mongoose, { Document, Schema, Types } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  PREPARING = 'Preparing',
  READY = 'Ready',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

// Reuse CartItem interface structure or define specifically for order history
export interface IOrderItem {
  food: Types.ObjectId;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  coupon?: Types.ObjectId;
  payment?: Types.ObjectId;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusHistory: IOrderStatusHistory[];
  deliveryAddress?: Types.ObjectId; // Reference to Address model, optional for dine-in/takeaway
  estimatedDelivery?: Date;
  kitchenNotes?: string;
  estimatedPrepTime?: number; // in minutes
  rider?: Types.ObjectId;
  tableNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderStatusHistory {
  status: OrderStatus;
  note?: string;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
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
      required: true, // Price captured at the time of order to prevent changes if Food price changes later
      min: [0, 'Price must be a positive number'],
    },
    specialInstructions: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const OrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: Object.values(OrderStatus),
          required: true,
        },
        note: {
          type: String,
          trim: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deliveryAddress: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
    },
    estimatedDelivery: {
      type: Date,
    },
    kitchenNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    estimatedPrepTime: {
      type: Number,
      min: 0,
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tableNumber: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customer: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
