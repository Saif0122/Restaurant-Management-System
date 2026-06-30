import mongoose, { Document, Schema, Types } from 'mongoose';

export enum ShiftStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export interface IShift extends Document {
  user: Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  status: ShiftStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShiftSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(ShiftStatus),
      default: ShiftStatus.ACTIVE,
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
ShiftSchema.index({ user: 1 });
ShiftSchema.index({ status: 1 });
ShiftSchema.index({ startTime: -1 });

const Shift = mongoose.model<IShift>('Shift', ShiftSchema);

export default Shift;
