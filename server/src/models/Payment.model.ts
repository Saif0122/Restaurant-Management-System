import mongoose, { Document, Schema, Types } from 'mongoose';
import { PaymentStatus } from './Order.model';

export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  PAYPAL = 'PayPal',
  STRIPE = 'Stripe',
  CASH_ON_DELIVERY = 'Cash on Delivery',
}

export interface IPayment extends Document {
  order: Types.ObjectId;
  customer: Types.ObjectId;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  providerResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
      unique: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: [true, 'Payment method is required'],
    },
    transactionId: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    providerResponse: {
      type: Schema.Types.Mixed, // Allows storing arbitrary JSON from payment provider
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
PaymentSchema.index({ order: 1 });
PaymentSchema.index({ transactionId: 1 }, { sparse: true }); // Sparse since Cash on Delivery might not have a transactionId initially
PaymentSchema.index({ customer: 1 });

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
