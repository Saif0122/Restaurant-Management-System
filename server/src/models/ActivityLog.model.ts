import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IActivityLog extends Document {
  user: Types.ObjectId;
  action: string;
  entity: string; // E.g., 'Order', 'Review'
  entityId?: Types.ObjectId;
  details?: any; // JSON representation of details
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
    },
    entity: {
      type: String,
      required: [true, 'Entity name is required'],
      trim: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
    },
    details: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
ActivityLogSchema.index({ user: 1 });
ActivityLogSchema.index({ action: 1 });
ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
