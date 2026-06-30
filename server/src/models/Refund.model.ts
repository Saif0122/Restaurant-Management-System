import mongoose, { Document, Schema, Types } from 'mongoose';

export enum RefundStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
}

export interface IRefund extends Document {
  order: Types.ObjectId;
  payment: Types.ObjectId;
  customer: Types.ObjectId;
  amount: number;
  reason: string;
  status: RefundStatus;
  adminRemarks?: string;
  providerRefundId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RefundSchema: Schema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: [true, 'Payment is required'],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: Object.values(RefundStatus),
      default: RefundStatus.PENDING,
    },
    adminRemarks: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    providerRefundId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
RefundSchema.index({ order: 1 });
RefundSchema.index({ payment: 1 });
RefundSchema.index({ customer: 1 });
RefundSchema.index({ status: 1 });

const Refund = mongoose.model<IRefund>('Refund', RefundSchema);

export default Refund;
