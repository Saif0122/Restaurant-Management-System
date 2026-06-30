import mongoose, { Document, Schema, Types } from 'mongoose';

export enum RestockRequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  FULFILLED = 'Fulfilled',
  REJECTED = 'Rejected',
}

export interface IRestockRequest extends Document {
  food: Types.ObjectId;
  requestedBy: Types.ObjectId;
  quantity: number;
  status: RestockRequestStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RestockRequestSchema: Schema = new Schema(
  {
    food: {
      type: Schema.Types.ObjectId,
      ref: 'Food',
      required: [true, 'Food item is required'],
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requested by user is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    status: {
      type: String,
      enum: Object.values(RestockRequestStatus),
      default: RestockRequestStatus.PENDING,
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
RestockRequestSchema.index({ food: 1 });
RestockRequestSchema.index({ requestedBy: 1 });
RestockRequestSchema.index({ status: 1 });
RestockRequestSchema.index({ createdAt: -1 });

const RestockRequest = mongoose.model<IRestockRequest>('RestockRequest', RestockRequestSchema);

export default RestockRequest;
